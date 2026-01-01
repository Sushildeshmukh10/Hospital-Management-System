import React, { Component } from 'react';
import Moment from 'react-moment';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import ProblemService from '../../../services/ProblemService';
import AlertifyService from '../../../services/AlertifyService';
import { withRouter } from 'react-router';

let filterAllProblem = [];
let filters = ["problemName", "problemStatus"];

class ProblemsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            patientid: props.patientid,
            problems: []
        };
    }

    componentDidMount() {
        this.getAllProblems();
    }

    getAllProblems = () => {
        ProblemService.getAllByPatientId(this.state.patientid)
            .then(res => {
                const data = res.data || [];
                filterAllProblem = data;
                this.setState({ problems: data });
            })
            .catch(() => {
                this.setState({ problems: [] });
            });
    };

    onChangeSearchByStatusOrDate = (e) => {
        this.filterProblems(e.target.value);
    };

    filterProblems(value) {
        if (value !== '') {
            const results = filterAllProblem.filter(problem =>
                filters.some(filter =>
                    (problem[filter] || "")
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            this.setState({ problems: results });
        } else {
            this.setState({ problems: filterAllProblem });
        }
    }

    limitingPatientDetail(data = "") {
        return data.length < 31 ? data : data.substr(0, 30) + "...";
    }

    deleteProblem = (problemid) => {
        alertify.confirm(
            "Are you sure to delete the problem?",
            () => {
                ProblemService.delete(problemid).then(() => {
                    AlertifyService.successMessage("Problem deleted successfully");
                    this.getAllProblems();
                });
            },
            () => AlertifyService.errorMessage("Delete cancelled")
        );
    };

    // ✅ FINAL FIXED VIEW METHOD
    viewProblem = (problemid) => {
        if (!problemid) {
            AlertifyService.errorMessage("Problem ID not found");
            return;
        }
        this.props.history.push('/problem/' + problemid);
    };

    render() {
        const { problems } = this.state;

        return (
            <div className="row">
                <div className="col-lg-12">
                    <hr />
                    <h3 className="text-center">Problems</h3>
                    <hr />

                    <input
                        type="text"
                        placeholder="Search Problem by Name or Status"
                        className="form-control mb-3"
                        onChange={this.onChangeSearchByStatusOrDate}
                    />

                    <div className="table-responsive">
                        <table className="table table-bordered table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Problem Name</th>
                                    <th>Problem Detail</th>
                                    <th>Status</th>
                                    <th>Create Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {problems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center text-warning">
                                            No problems found
                                        </td>
                                    </tr>
                                ) : (
                                    problems.map(problem => (
                                        <tr key={problem.problemid}>
                                            <td>{problem.problemName}</td>
                                            <td>{this.limitingPatientDetail(problem.problemDetail)}</td>
                                            <td>{problem.problemStatus}</td>
                                            <td>
                                                {problem.creationDate ? (
                                                    <Moment format="YYYY/MM/DD HH:mm">
                                                        {problem.creationDate}
                                                    </Moment>
                                                ) : "N/A"}
                                            </td>
                                            <td>
                                                {/* ✅ VIEW BUTTON – FIXED */}
                                                <button
                                                    className="btn btn-sm btn-info mr-1"
                                                    onClick={() => this.viewProblem(problem.problemid)}
                                                >
                                                    View
                                                </button>

                                                {/* ✅ DELETE BUTTON */}
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => this.deleteProblem(problem.problemid)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProblemsComponent);

import React, { Component } from 'react'
import PatientService from '../../services/PatientService';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import DatePicker from "react-datepicker";
import AlertifyService from '../../services/AlertifyService';

class AddPatientComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            lastname: '',
            email: '',
            phoneNo: '',
            gender: 'Male',
            city: 'ANKARA',
            bornDate: new Date(),
            status: 1,
            cities: []
        };
    }

    componentDidMount() {
        this.getAllCities();
    }

    getAllCities() {
        PatientService.getCities()
            .then(res => {
                this.setState({ cities: res.data });
            })
            .catch(() => {
                AlertifyService.alert("Failed to load cities");
            });
    }

    controlQuickly() {
        return (
            !this.state.name.trim() ||
            !this.state.lastname.trim() ||
            !this.state.phoneNo.trim()
        );
    }

    saveUser = (e) => {
        e.preventDefault();

        if (this.controlQuickly()) {
            AlertifyService.alert("Please fill all required (*) fields");
            return;
        }

        // ✅ BACKEND COMPATIBLE PAYLOAD
        const patient = {
            name: this.state.name.trim(),
            lastname: this.state.lastname.trim(),
            phoneNo: String(this.state.phoneNo),
            email: this.state.email,
            gender: this.state.gender.toUpperCase(), // MALE / FEMALE
            city: this.state.city,
            bornDate: this.state.bornDate
                .toISOString()
                .split("T")[0], // yyyy-MM-dd
            status: 1
        };

        console.log("Sending patient =>", patient);

        PatientService.addPatient(patient)
            .then(() => {
                alertify.success("Patient added successfully");
                this.props.history.push('/patients');
            })
            .catch(error => {
                console.error("Backend error =>", error.response?.data);
                AlertifyService.alert(
                    error.response?.data?.message || "Invalid patient data"
                );
            });
    }

    onChangeData = (key, value) => {
        this.setState({ [key]: value });
    }

    back() {
        this.props.history.push('/patients');
    }

    render() {
        const { name, lastname, phoneNo, email, bornDate, gender, city, cities } = this.state;

        return (
            <div className="row">
                <div className="col-sm-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}>
                        Back
                    </button>
                    <hr />
                </div>

                <div className="col-sm-8">
                    <h2 className="text-center">ADD PATIENT</h2>

                    <form onSubmit={this.saveUser}>
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={e => this.onChangeData('name', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={lastname}
                                onChange={e => this.onChangeData('lastname', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={phoneNo}
                                onChange={e => this.onChangeData('phoneNo', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={e => this.onChangeData('email', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Born Date *</label>
                            <DatePicker
                                className="form-control"
                                selected={bornDate}
                                onChange={date => this.onChangeData('bornDate', date)}
                                dateFormat="yyyy/MM/dd"
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender *</label>
                            <select
                                className="form-control"
                                value={gender}
                                onChange={e => this.onChangeData('gender', e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>City *</label>
                            <select
                                className="form-control"
                                value={city}
                                onChange={e => this.onChangeData('city', e.target.value)}
                            >
                                {cities.map(c =>
                                    <option key={c} value={c}>{c}</option>
                                )}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-success">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddPatientComponent;

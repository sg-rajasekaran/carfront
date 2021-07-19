import React, { Component } from 'react';
import {SERVER_URL} from '../constants';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';

//To toast with a message
//import { ToastContainer, toast } from "react-toastify";
//import 'react-toastify/dist/ReactToastify.css'

//Confirmation dialog
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'

//For adding car
import AddCar from "./AddCar.js";

//For CSV reports
import { CSVLink } from 'react-csv';

//For Button
import Button from '@material-ui/core/Button';
//For Grid
import Grid from '@material-ui/core/Grid';
//For SnackBar - (remove toastify)
import Snackbar from "@material-ui/core/Snackbar";

class Carlist extends Component {

    constructor(props) {
        super (props);
        this.state = { cars: [], open: false, message: '' };
    }

    componentDidMount() {
        this.fetchCars();
    }

    //Fetch all cars
    fetchCars = () => {
        //Read the token from the session storage
        //and include it to Authentication header
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + '/api/cars', {
            headers: { 'Authorization': token }
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    cars: responseData._embedded.cars,
                });
            })
            .catch(err => console.error(err));
    }

    // Add new car
    addCar(car) {
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + '/api/cars',
            { method: 'POST',
                   headers: {
                    'Content-Type': 'application/json', 'Authorization': token
                   },
                    body: JSON.stringify(car)
            })
            .then(res => this.fetchCars())
            .catch(err => console.error(err))
    }

    //Edit Cars
    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={ e => {
                    const data = [...this.state.cars];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({cars: data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.cars[cellInfo.index][cellInfo.column.id]
                }}
                />
        );
    }

    //Update car
    updateCar(car, link) {
        const token = sessionStorage.getItem("jwt");
        fetch(link,
            { method: 'PUT',
                   headers: {
                    'Content-Type': 'application/json', 'Authorization': token
                   },
                   body: JSON.stringify(car)
            })
            .then( res =>
                    this.setState({open: true, message: 'Changes saved'})
            ).catch( err =>
                this.setState({open: true, message: 'Error when saving'})
            )
    }



    //Function to confirm delete
    confirmDelete = (link) => {
        confirmAlert({
            message: 'Are you sure to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.onDelClick(link)
                },
                {
                    label: 'No',
                }
            ]
        })
    }
    //Delete Cars
    onDelClick = (link) => {
        const token = sessionStorage.getItem("jwt");
        fetch(link, {method: 'DELETE', headers: {'Authorization':token}})
            .then (res => {
                this.setState({open: true, message: 'Car Deleted'});
                this.fetchCars();
            })
            .catch(err => {
                this.setState({open: true, message: 'Error when Deleting'});
                console.error(err)
            })
    }

    //handleClose
    handleClose = (event, reason) => {
        this.setState( { open: false });
    }

    render() {
        const columns = [ {
            Header: 'Brand',
            accessor: 'brand',
            Cell: this.renderEditable
        }, {
            Header: 'Model',
            accessor: 'model',
            Cell: this.renderEditable
        }, {
            Header: 'Color',
            accessor: 'color',
            Cell: this.renderEditable
        }, {
            Header: 'Year',
            accessor: 'year',
            Cell: this.renderEditable
        }, {
            Header: 'Price',
            accessor: 'price',
            Cell: this.renderEditable
        }, {
            id: 'savebutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: ({value, row}) =>
                (<Button size="small" variant="outlined" color="primary"
                    onClick={() => {this.updateCar(row, value)}}>Save</Button>)
        }, {
            id: 'delbutton',
            sortable: false,
            filterable: false,
            width: 100,
            accessor:'_links.self.href',
            Cell: ({value}) =>
                (<Button size="small" variant="outlined" color="secondary"
                    onClick={ () => {this.confirmDelete(value)}}>Delete</Button>)
            }
    ]

        return (
            <div className="App">
                <Grid container>
                    <Grid item>
                        <AddCar addCar={this.addCar} fetchCars = {this.fetchCars} />
                    </Grid>
                    <Grid item style={{padding: 20}}>
                        <CSVLink data={this.state.cars} separator=";">Export CSV</CSVLink>
                    </Grid>
                </Grid>

                <ReactTable data={this.state.cars} columns={columns} filterable={true} pagesize={10}/>
                <Snackbar style = {{width:300, color: 'red'}}
                    open={this.state.open} onClose={this.handleClose}
                    autoHideDuration={1500} message={this.state.message} />

            </div>
        );
        /* Commenting the basic rendering
        const tableRows = this.state.cars.map((car, index) =>
        <tr key={index}><td>{car.brand}</td>
            <td>{car.model}</td><td>{car.color}</td>
            <td>{car.year}</td><td>{car.price}</td></tr>);


        return (
            <div className="App">
                <table><tbody>{tableRows}</tbody></table>
            </div>
            );*/
        /*
                <CSVLink data={this.state.cars} separator=";">Export CSV</CSVLink>
                <AddCar addCar={this.addCar} fetchCars={this.fetchCars} />
                */
    }
}
export default Carlist;

import { Component } from "react";
import { Button } from "react-bootstrap";
import './forza4.css';

class Forza4 extends Component {
    
    bgButton(value) {
        switch (value) {
            case null:
                return 'bg-light';
            case 'me':
                return 'bg-danger';
            case 'opponent':
                return 'bg-warning';
            default:
                return '';
        }
    }

    render() {
        return (
            <div className="container bg-primary rounded" style={{width: '65%'}}>
                {this.props.board.map((row, i) => (
                    <div key={i} className="row d-flex justify-content-evenly text-center px-0">
                        {row.map((btnStr, i) => (
                            <div key={i} className="col-sm">
                                <Button key={i} id={"btn" + parseInt(i / 7) + "" + i % 7} className={'m-3 btn-circle btn-xl ' + this.bgButton(btnStr)} onClick={(e) => this.props.onMove(e)} disabled={!this.props.turn}/>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default Forza4;
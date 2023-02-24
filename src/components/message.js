import { Component } from "react";
import avatar1 from '../img/avatar1.svg'
import avatar2 from '../img/avatar2.svg'

class Message extends Component {
    render() {
        if (this.props.message.isOpponent)
            return (
                <>
                    <div className="d-flex justify-content-between">
                        <p className="small mb-1">{this.props.message.name}</p>
                        <p className="small mb-1 text-muted">{this.props.message.when}</p>
                    </div>
                    <div className="d-flex flex-row justify-content-start">
                        <img
                            src={avatar1}
                            alt="avatar 1"
                            style={{ width: "45px", height: "100%" }}
                        />
                        <div>
                            <p className="small p-2 ms-3 mb-3 rounded-3 bg-light">
                                {this.props.message.text + '\n'}
                            </p>
                        </div>
                    </div>
                </>
            );
        else
            return (
                <>
                    <div className="d-flex justify-content-between">
                        <p className="small mb-1 text-muted">{this.props.message.when}</p>
                        <p className="small mb-1">{this.props.message.name}</p>
                    </div>
                    <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                        <div>
                            <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-primary">
                                {this.props.message.text +  "\n"}
                            </p>
                        </div>
                        <img
                        src={avatar2}
                        alt="avatar 1"
                        style={{ width: "45px", height: "100%" }}
                        />
                    </div>
                </>
            );
    }
}

export default Message;

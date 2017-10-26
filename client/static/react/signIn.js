import React from 'react';
import 'static/css/landing.css';

var signIn = React.createClass ({
    render : function() {
        return (
            <div className="signin-container">
                <form id="signin" action="">
                    <table>
                        <thead>
                        <tr>
                            <td>
                                <h4>Already registered?</h4>
                                <h1>Sign In</h1>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Email</p>
                                <input className="email" type="email" name="email" required />
                                <a className="forgot" href="">Forgot your email?</a>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Password</p>
                                <input className="password" type="password" name="password" required />
                                <a className="forgot" href="">Forgot your password?</a>
                            </td>
                        </tr>
                        <tr>
                            <td style={{textAlign: "center"}}>
                                <input type="submit" name="signin" value="Sign In" />
                            </td>
                        </tr>
                        </thead>
                    </table>
                </form>
                {/*<!-- Error -->*/}
                <div className="error-bg">
                    <div className="error">
                        <p className="message">Sign In Failed...</p>
                        <p className="retry">Retry</p>
                    </div>
                </div>
            </div>
        );
    }
});

export default signIn;
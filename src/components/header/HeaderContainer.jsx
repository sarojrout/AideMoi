/** @jsx React.DOM */
'use strict';
var React = require('react');
require("styles/dashboard.less");
var logo_path = require('images/bell_icon.png');
var search_icon_path = require('images/search.png');
var bell_icon_path = require('images/bell_icon.png')

var HeaderContainer = React.createClass({
    _setActive: function(app){
        return app === this.props.active ? "active" : "";
    },
    signOut: function(){
        sessionStorage.removeItem("userid");
        this.props.logOut();
    },
    render: function() {
        return (
            <div id="header">
                <h2 className="logo-container col-md-1">
                    <a href="#" className="logo" id="in-logo">
                        <img src={logo_path} />
                    </a>
                </h2>
                <ul className="nav nav-tabs col-md-7 app-tabs">
                    <li role="presentation" className={"dashboard " + this._setActive("dashboard")}>
                        <a href="/dashboard">Trade</a>
                    </li>
                    <li role="presentation" className={"apps " + this._setActive("apps")}>
                        <a href="/apps">Apps</a>
                    </li>
                    <li role="presentation" className={"apis " + this._setActive("apis")}>
                        <a href="/apis">API</a>
                    </li>
                    <li role="presentation" className={"admin " + this._setActive("admin")}>
                        <a href="/admin">Admin</a>
                    </li>
                    
                </ul>
                <div className="header-control">
                    <div className="search-control">
                        <img className="search-icon" src={search_icon_path}/>
                        <input type="text" placeholder="Search"/>
                    </div>
                    <img className="bell-icon" src={bell_icon_path}/>
                    <div className="login">
                        charles@aqi.com | <a onClick={this.signOut}>Sign out</a>
                    </div>
                </div>
            </div>
        );
        
    }
});

module.exports = HeaderContainer;
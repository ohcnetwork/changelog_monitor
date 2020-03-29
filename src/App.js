import React from 'react';
import logo from './assets/images/coronaSafeLogo.svg'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import {
	Link
} from "react-router-dom";

class App extends React.Component {
	constructor() {
		super()
		this.state = {
			repoList: [],
			repoData: [],
			repoCommitData: []
		}
	}
	componentWillMount() {
		fetch('https://api.github.com/users/coronasafe/repos?per_page=100')
			.then(response => response.json())
			.then(data => {
				this.setState({ repoList: data })
			})
		if (this.props.match.params.repo) this.fetchRepoData()
	}



	fetchRepoData() {
		var repo = this.props.match.params.repo;
		fetch('https://api.github.com/repos/coronasafe/' + repo + '/commits?per_page=100')
			.then(response => response.json())
			.then(data => {
				this.setState({ repoCommitData: data })
			})
		fetch('https://api.github.com/repos/coronasafe/' + repo)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				this.setState({ repoData: data })
			})
	}

	renderRepoList() {
		return (
			<div className="container" >
				<br></br>
				<h3>Changelog Monitor</h3>
				<p>Changelog monitor for all coronasafe repositories</p>
				{this.state.repoList.map((item, index) => (
					<div key={index} className="row repoRow border	 rounded m-3">
						<div className=" listIcon"><i className="fab fa-git-alt"></i></div>
						<div className="listDetails">
							<div className="listRepoName">{item.name}</div>
							<div className="listDesc">{item.description}</div><br></br>
							<span className="issueCount"><i className="fa fa-info-circle"></i> &nbsp; {item.open_issues_count}</span>
							<span className="forksCount"><i className="fa fa-code-branch"></i> &nbsp; {item.forks_count}</span>
						</div>
						<div className="listOpenBtn">
							<Link to={"/view/" + item.name}><button className="btn ">View Details</button></Link>
						</div>
					</div>
				))}
			</div>
		)
	}

	renderRepoView() {
		var repo = this.state.repoData;
		return (
			<div className="container" >
				<br></br>
				<div className=" row">
					<div className="repoIcon">
						<i className="fab fa-git-alt"></i>
					</div>
					<div className="p-4 col-md-8">
						<h2><strong>{repo.name}</strong></h2>
						<p>
							{repo.description}<br />
							<small className="muted"> <i className="fa fa-file-signature"> </i> &nbsp;{repo.license?.name}</small>
						</p>
						<p>
						<span className="issueCount"><i className="fa fa-info-circle"></i> &nbsp; {repo.open_issues_count}</span>
						<span className="forksCount"><i className="fa fa-code-branch"></i> &nbsp; {repo.forks_count}</span>
						</p>
					</div>
				</div>
				<h5>commit history</h5>
				<hr></hr>
				{this.state.repoCommitData?.map((item, index) => (
					<div key={index} className="commitList row border shadow-sm m-3 rounded">
						<div className="commitAvatar "><img className="rounded-circle" src={item.author?.avatar_url} /></div>
						<div className=" commitDetails">
							<strong>{item.commit.author.name}</strong><br />
							<p className="commitMessage">{item.commit.message}</p><br />
							<a href={item.html_url} className="commitSHA">{item.sha}</a><br />
							{item.commit.verification.verified ? <span className="commitVerification"><i className="fa fa-check-circle green"> </i>&nbsp; verified</span> : <span className="commitVerification"><i className="fa fa-times-circle red"> </i>&nbsp; not verified</span>}

						</div>
						<div className="commitTime col-md-3 p-3">
							{this.timeSince(new Date(item.commit.author.date))}
						</div>
					</div>
				))}

			</div>
		)
	}

	timeSince(time) {
		switch (typeof time) {
			case 'number':
				break;
			case 'string':
				time = +new Date(time);
				break;
			case 'object':
				if (time.constructor === Date) time = time.getTime();
				break;
			default:
				time = +new Date();
		}
		var time_formats = [
			[60, 'seconds', 1], // 60
			[120, '1 minute ago', '1 minute from now'], // 60*2
			[3600, 'minutes', 60], // 60*60, 60
			[7200, '1 hour ago', '1 hour from now'], // 60*60*2
			[86400, 'hours', 3600], // 60*60*24, 60*60
			[172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
			[604800, 'days', 86400], // 60*60*24*7, 60*60*24
			[1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
			[2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
			[4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
			[29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
			[58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
			[2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
			[5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
			[58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
		];
		var seconds = (+new Date() - time) / 1000,
			token = 'ago',
			list_choice = 1;

		if (seconds == 0) {
			return 'Just now'
		}
		if (seconds < 0) {
			seconds = Math.abs(seconds);
			token = 'from now';
			list_choice = 2;
		}
		var i = 0,
			format;
		while (format = time_formats[i++])
			if (seconds < format[0]) {
				if (typeof format[2] == 'string')
					return format[list_choice];
				else
					return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
			}
		return time;
	}

	render() {
		return (
			<>
				<nav className="navbar navbar-light bg-white shadow-sm border-bottom">
					<div className="container">
						<img src={logo}></img>
					</div>
				</nav>
				{this.props.view === 'repoList' ? this.renderRepoList() : null}
				{this.props.view === 'repoView' ? this.renderRepoView() : null}

			</>
		)
	}

}

export default App;

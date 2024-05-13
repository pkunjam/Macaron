
import React from 'react';
import d3 from 'd3';

var PlaybackStore = require('./stores/playbackstore.js');
var VTIconStore = require('./stores/vticonstore.js');

var ControlBar = React.createClass({

	propTypes: {
		name : React.PropTypes.string.isRequired,
		playing: React.PropTypes.bool.isRequired,
		mute: React.PropTypes.bool.isRequired
			},

	getDefaultProps: function() {
	    return {
	      width:'100%',
	      background:'lightgrey',
	      fontSize: "28pt",


	    }
	},


	/**
	* Event handlers
	* 
	*/
	_onMuteClick : function (event) {
		PlaybackStore.actions.toggleMute();
	},

	_onPlayClick : function (event) {
		VTIconStore.actions.selectVTIcon(this.props.name);
		PlaybackStore.actions.togglePlaying();

		// Audio playback
		var musicPlayer = document.getElementById("musicPlayer");
		const deviceList = document.getElementById('audioOutputDeviceList');

		// Function to populate device list
		function updateDeviceList(devices) {
			deviceList.innerHTML = '';
			devices.forEach((device) => {
				if (device.kind === 'audiooutput') {
					const option = document.createElement('option');
					option.value = device.deviceId;
					option.text = device.label || `Device ${device.deviceId}`;
					deviceList.appendChild(option);
				}
			});
		}

		// Change audio output
		deviceList.addEventListener('change', () => {
			const selectedDeviceId = deviceList.value;
			musicPlayer.setSinkId(selectedDeviceId)
				.then(() => console.log(`Output device set to ${selectedDeviceId}`))
				.catch(err => console.error('Failed to set audio output device:', err));
		});

		// Request permissions and list devices
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(() => navigator.mediaDevices.enumerateDevices())
			.then(updateDeviceList)
			.catch(err => console.error('Failed to get media devices:', err));

		if (musicPlayer.paused) {
			musicPlayer.play();
		  } else {
			musicPlayer.pause();
		  }

	},

	_onSkipBackwardClick : function (event) {
		VTIconStore.actions.selectVTIcon(this.props.name);
		PlaybackStore.actions.skipBackward();
	},

	_onSkipForwardClick : function (event) {
		VTIconStore.actions.selectVTIcon(this.props.name);
		PlaybackStore.actions.skipForward();
	},

	/**
	* Rendering
	* 
	*/

	render : function() {

		var divStyle = {
			height:this.props.height,
			width:this.props.width,
			background:this.props.background,
			fontSize:this.props.fontSize,
			className:'unselectable'
		};

		var timeControlStyle  = {
			marginLeft:'auto',
			marginRight:'auto',
			textAlign:'center'
		};

		var buttonStyle = {
			marginLeft:'0.5em',
			marginRight:'0.5em',
			className:'unselectable'
		};

		var iconText = "fa fa-play";
		if (this.props.playing) {
			iconText = "fa fa-pause";
		}

		return (
			<div className="controlbar" style={divStyle}>
				<div className="time-control" style={timeControlStyle}>
					<select id="audioOutputDeviceList"></select>

					 <a class="btn" href="#"><i onClick={this._onSkipBackwardClick} className="fa fa-step-backward" style={buttonStyle}></i></a>
					 <a class="btn" href="#"><i onClick={this._onPlayClick} className={iconText} style={buttonStyle}></i></a>
					 <a class="btn" href="#"><i onClick={this._onSkipForwardClick} className="fa fa-step-forward" style={buttonStyle}></i></a>
					 <a class="btn" href="#"><span onClick={this._onMuteClick} className="unselectable mute"><input type="checkbox" checked={this.props.mute}/>Mute</span></a>
				</div>	
			</div>
			);
	}

});

module.exports = ControlBar;
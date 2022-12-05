import axios from 'axios'
import { getHashParams } from '../utils'

//TOKEN *****************************************************************************************************************
const EXPIRATION_TIME = 3600 * 1000;
const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp',Date.now());
const setLocalAccessToken = token => {
	setTokenTimestamp();
	window.localStorage.setItem('spotify_access_token', token);
}
const setLocalRefreshToken = token => window.localStorage.setItem('spotify_refresh_token', token);
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getLocalAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getLocalRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');

//Refresh the token
const refreshAccessToken = async () => {
	try{
		const { data }= await axios.get(`refresh_token?refresh_token=${getLocalRefreshToken()}`);
		const { access_token } = data;
		setLocalAccessToken(access_token);
		window.location.reload();
		return;
	}catch(e){
		console.log(e)
	}
}

//Get access token off of query params (called on application unit)
export const getAccessToken = () => {
	const { error, access_token, refresh_token } = getHashParams();

	if(error){
		console.log(error);
		refreshAccessToken();
	}

	//If token has expired
	if(Date.now() - getTokenTimestamp > EXPIRATION_TIME){
		console.warn('Access token has expired, refreshing..')
		refreshAccessToken();
	}

	const localAccessToken = getLocalAccessToken();

	//If there is no Access token in localStorage, set it and return `access_token` from params
	if((!localAccessToken || localAccessToken === 'undefined') && access_token){
		setLocalAccessToken(access_token);
		setLocalRefreshToken(refresh_token);
		return access_token;
	}

	return localAccessToken;
}

export const token = getAccessToken();

export const logout = () => {
	window.localStorage.removeItem('spotify_token_timestamp');
	window.localStorage.removeItem('spotify_access_token');
  	window.localStorage.removeItem('spotify_refresh_token');
 	window.location.reload();
};

// API CALLS ***************************************************************************************

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

import React from "react";
import "./App.css";
import { w3cwebsocket } from "websocket";
import { Card, Avatar, Typography, Input } from "antd";
import "antd/dist/antd.css";

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new w3cwebsocket("wss://mywebsocketserver.herokuapp.com/");

function App() {
	const [username, setUsername] = React.useState("");
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);
	const [messages, setMessages] = React.useState([]);
	const [searchVal, setSearchVal] = React.useState("");

	const sendMesssage = (value) => {
		client.send(
			JSON.stringify({
				type: "message",
				msg: value,
				user: username,
			})
		);

		setSearchVal("");
	};
	React.useEffect(() => {
		client.onopen = () => {
			console.log("websocket client connected");
		};
		client.onmessage = (message) => {
			const messageFromServer = JSON.parse(message.data);

			if (messageFromServer.type === "message") {
				setMessages((messages) => {
					return [
						...messages,
						{ user: messageFromServer.user, msg: messageFromServer.msg },
					];
				});
			}
		};
	}, []);

	return (
		<div className="main">
			<div className="title">
				<Text type="secondary" style={{ fontSize: "36px" }}>
					Emi's Chat App
				</Text>
			</div>

			<div
				id="card"
				style={{
					display: "flex",
					flexDirection: "column",
					paddingBottom: 50,
				}}>
				{messages.map((msg, index) => {
					return (
						<Card
							key={index}
							style={{
								height: "100%",
								overflowY: "visible",
								width: 300,
								margin: "16px 4px 0 4px",
								alignSelf: username === msg.user ? "flex-end" : "flex-start",
							}}>
							<Meta
								avatar={
									<Avatar
										style={{
											color: "#f56a00",
											backgroundColor: "#fde3cf",
										}}>
										{msg.user[0].toUpperCase()}
									</Avatar>
								}
								title={msg.user}
								description={msg.msg}
							/>
						</Card>
					);
				})}
			</div>
			{isLoggedIn ? (
				<div className="bottom">
					<Search
						placeholder="Input value and send"
						enterButton="Send"
						size="large"
						value={searchVal}
						onChange={(e) => setSearchVal(e.target.value)}
						onSearch={(value) => sendMesssage(value)}
					/>
				</div>
			) : (
				<div style={{ padding: "200px 40px" }}>
					<Search
						placeholder="Enter username"
						enterButton="Login"
						size="large"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						onSearch={() => setIsLoggedIn(true)}
					/>
				</div>
			)}
		</div>
	);
}

export default App;

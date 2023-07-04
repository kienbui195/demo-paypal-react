import React, { useState } from 'react';

const Button = ({ onClick, label, disabled, loading }) => {
	const [hover, setHover] = useState(false);
	
	const handleOnClick = () => {
		onClick && onClick();
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				cursor: (loading || disabled) ? 'default' : 'pointer',
				userSelect: 'none',
				border: '1px solid black',
				padding: '5px 8px',
				background: (loading || disabled) ? '' : hover ? 'black' : '',
				color: (loading || disabled) ? '': hover ? 'white' : 'black',
				marginTop: '5px'
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={(disabled || loading) ? () => {} : () => handleOnClick()}>
			{loading ? 'Loading...' : label}
		</div>
	);
};

export default Button;

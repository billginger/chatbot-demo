import React from 'react';
import PortalContent from './PortalContent.jsx';

const content = (
	<p>404</p>
);

const NoMatch = () => (
	<PortalContent content={content} />
);

export default NoMatch;

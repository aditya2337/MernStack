import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';

ReactDOM.render(
  <CommentBox
    url='https://merncommentbox-usuwtgqvqd.now.sh/api/comments'
    pollInterval={2000}/>,
  document.getElementById('root')
);

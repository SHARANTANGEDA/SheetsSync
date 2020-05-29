import React from 'react'
import loading from './loading.gif'

export default () => {
  return (
    <div className='text-center d-flex justify-content-center'>
      <img
        src={loading}
        style={{ width: '300px', margin: 'auto', display: 'block' }}
        alt="Loading..."
      />
    </div>
  );
};

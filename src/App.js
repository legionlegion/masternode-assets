import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <div className='row'>
        <div className='col'>
          <h1 className='mt-3'>Masternode Assets under management!</h1>
        </div>
        <hr className='mb-3'></hr>
      </div>
      <div className='row'>
        <Outlet />
      </div>
    </div>
  );
}

export default App;

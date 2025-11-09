import "bootstrap/dist/css/bootstrap.min.css";
function Outlet() {
  return (
       <>
      {/* Carousel 1 */}
      <div className="container-fluid">
        <div id="demo" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
            <button data-bs-target="#demo" data-bs-slide-to="1"></button>
            <button data-bs-target="#demo" data-bs-slide-to="2"></button>
            <button data-bs-target="#demo" data-bs-slide-to="3"></button>
            <button data-bs-target="#demo" data-bs-slide-to="4"></button>
            <button data-bs-target="#demo" data-bs-slide-to="5"></button>
            <button data-bs-target="#demo" data-bs-slide-to="6"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="../assets/Images/BUILD-YOUR-WARDROBE-WEB.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/WOMAN_1920X900_1.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/DRESSES_1920X900_b6bf6571-1f8f-4a24-b7f4-79f894cab474.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/Loungewear_1920X900_7af61f03-8c5b-4ccb-af0f-cf9f7c9fa60e.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/GENZ_STORE_1920X900_d75a7f43-e3e0-420d-9af4-208b3d9a5dca.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/WOMAN_1920X900_1.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="../assets/Images/FOOTWEAR_1920X900_4caaa9cf-6a78-4fa3-b36b-ee3b97be2a1b.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#demo" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#demo" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
      
      {/* Carousel 2 */}
      <div className="container-fluid">
        <div id="demo1" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button data-bs-target="#demo1" data-bs-slide-to="0" className="active"></button>
            <button data-bs-target="#demo1" data-bs-slide-to="1"></button>
            <button data-bs-target="#demo1" data-bs-slide-to="2"></button>
            <button data-bs-target="#demo1" data-bs-slide-to="3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="Images/MAN_1920X900_121aad31-d4c0-46bc-80e4-a8b6d37abb38.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/UNDERWEAR_1920X900_1_db9d1a80-1f36-4557-81b2-7a77d8524f42.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/CASUAL_SHIRTS_1920X900_a7fc5a4e-b61d-4f1f-8fc0-a623f51306c9.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/CASUAL_SHIRTS_1920X900_a7fc5a4e-b61d-4f1f-8fc0-a623f51306c9.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#demo1" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#demo1" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Carousel 3 */}
      <div className="container-fluid">
        <div id="demo2" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button data-bs-target="#demo2" data-bs-slide-to="0" className="active"></button>
            <button data-bs-target="#demo2" data-bs-slide-to="1"></button>
            <button data-bs-target="#demo2" data-bs-slide-to="2"></button>
            <button data-bs-target="#demo2" data-bs-slide-to="3"></button>
            <button data-bs-target="#demo2" data-bs-slide-to="4"></button>
            <button data-bs-target="#demo2" data-bs-slide-to="5"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="Images/1.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/2.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/3.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/4.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/5.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/6.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#demo2" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#demo2" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Carousel 4 */}
      <div className="container-fluid">
        <div id="demo3" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button data-bs-target="#demo3" data-bs-slide-to="0" className="active"></button>
            <button data-bs-target="#demo3" data-bs-slide-to="1"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="Images/BOYS_1920X900_5f5c797b-7770-40d2-8822-a1ee456736f7.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/GIRLS_1920X900_75d4cac8-54a6-47f5-a67d-23da1c41c64f.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#demo3" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#demo3" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Carousel 5 */}
      <div className="container-fluid">
        <div id="demo4" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button data-bs-target="#demo4" data-bs-slide-to="0" className="active"></button>
            <button data-bs-target="#demo4" data-bs-slide-to="1"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="Images/11.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
            <div className="carousel-item">
              <img src="Images/12.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-target="#demo4" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#demo4" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
      {/* Banner Image */}
      <div className="container-fluid">
        <img src="Images/WS_Web_Hero_Banner.webp" alt="" className="d-block" style={{ width: "100%", height: "500px" }} />
      </div>
    </>
);
}

export default Outlet;

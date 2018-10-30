import PropTypes from 'prop-types';
import React from 'react';
import {Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';

const RenderMenuItem = ({dish, onClick}) => (
    <Card>
      <Link to={`/menu/${dish.id}`}>
        <CardImg width="100%" src={dish.image} alt={dish.name}/>
        <CardImgOverlay>
          <CardTitle>{dish.name}</CardTitle>
        </CardImgOverlay>
      </Link>
    </Card>
);

function Menu(props) {
    const menu = props.dishes.map((dish) => {
      return (
          <div key={dish.id} className="col-12 col-md-5 m-1">
            <RenderMenuItem dish={dish}/>
          </div>
      );
    });

    return (
        <div className="container">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
              <BreadcrumbItem active>Menu</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3>Menu</h3>
              <hr/>
            </div>
          </div>
          <div className="row">
            {menu}
          </div>
        </div>
    );
}
export default Menu;

RenderMenuItem.propTypes = {
  dish: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

Menu.propTypes = {
  dishes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func
};
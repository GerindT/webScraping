import PropTypes from "prop-types";
import { push as Menu } from "react-burger-menu";
import { FaArrowRight } from "react-icons/fa";

const Sidebar = ({ isOpen, closeMenu, showChart, setShowChart }) => {
  return (
    <Menu
      isOpen={isOpen}
      pageWrapId={"page-wrap"}
      noOverlay
      disableAutoFocus
      styles={styles}
      onStateChange={({ isOpen }) => (isOpen ? null : closeMenu())}
      customBurgerIcon={
        <div className="menu-icon">
          <FaArrowRight size={24} />
        </div>
      }
    >
      <button onClick={() => setShowChart(!showChart)}>Toggle Chart</button>
    </Menu>
  );
};

const styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "40px",
    height: "40px",
    left: "10px",
    top: "10px",
  },

  bmCrossButton: {
    height: "40px",
    width: "40px",
  },
  bmCross: {
    background: "#bdc3c7",
  },
  bmMenu: {
    background: "#3d3d3d",
    padding: "1.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  showChart: PropTypes.bool.isRequired,
  setShowChart: PropTypes.func.isRequired,
};

export default Sidebar;

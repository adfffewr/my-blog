import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderBox = styled.header`
  width: 100%;
  height: 50px;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1000;
  background-color: #6c63ff;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  /* @media (prefers-color-scheme: dark) {
    background-color: #333;
  } */
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  h1 {
    margin-right: 10px;
  }
`;

const HeaderNav = styled.nav`
  transition: 0.3s;
  overflow-y: hidden;
  ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  ul li {
    transition: 0.2s;
  }
  ul li a {
    color: #fff;
    padding: 0 10px;
    transition: color 0.2s;
  }
  ul li a:hover {
    color: rgba(255, 255, 255, 0.75);
  }
  @media screen and (max-width: 768px) {
    position: absolute;
    left: 0%;
    top: 50px;
    width: 100%;
    background-color: #6c63ff;
    max-height: 0;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
    &.active {
      max-height: 140px;
    }
    ul li {
      width: 100%;
    }
    ul li:hover {
      background-color: #5b54d8;
    }
    ul li a {
      display: block;
      padding: 10px;
    }
  }
  /* @media screen and (max-width: 768px) and (prefers-color-scheme: dark) {
    background-color: #333;
    ul li:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  } */
`;

const HeaderNavBtn = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 27px;
  height: 20px;
  display: none;
  span {
    position: absolute;
    left: 50%;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transition: 0.3s;
  }
  .line1 {
    top: 0;
    transform: translate(-50%);
  }
  .line2 {
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .line3 {
    top: 100%;
    transform: translate(-50%, -100%);
  }
  &.active {
    .line1 {
      top: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    .line2 {
      opacity: 0;
    }
    .line3 {
      top: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [active, setActive] = useState('');

  const NavBtnClick = () => {
    setActive(active === '' ? 'active' : '');
  };
  return (
    <>
      <HeaderBox>
        <HeaderContent className="max_box">
          <h1>
            <Link to="/">로고</Link>
          </h1>
          <HeaderNav className={active}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/post">Post</Link>
              </li>
              <li>
                <Link to="/todo">todo</Link>
              </li>
            </ul>
          </HeaderNav>
          <HeaderNavBtn className={active} onClick={NavBtnClick}>
            <span className="line1"></span>
            <span className="line2"></span>
            <span className="line3"></span>
          </HeaderNavBtn>
        </HeaderContent>
      </HeaderBox>
    </>
  );
};

export default Header;

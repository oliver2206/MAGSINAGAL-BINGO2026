import React, { useState } from 'react';
import './Header.css';

function Header({ darkMode, toggleDarkMode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return ( <
        header className = { `header ${darkMode ? 'dark' : 'light'}` } >
        <
        div className = "container header-container" >
        <
        div className = "logo" >
        <
        h2 > ✨MyWebsite < /h2> <
        /div>

        <
        button className = "mobile-menu-btn"
        onClick = { toggleMenu } > ☰
        <
        /button>

        <
        nav className = { `nav-menu ${isMenuOpen ? 'active' : ''}` } >
        <
        ul >
        <
        li > < button onClick = {
            () => scrollToSection('hero') } > Home < /button></li >
        <
        li > < button onClick = {
            () => scrollToSection('about') } > About < /button></li >
        <
        li > < button onClick = {
            () => scrollToSection('services') } > Services < /button></li >
        <
        li > < button onClick = {
            () => scrollToSection('contact') } > Contact < /button></li >
        <
        /ul> <
        button className = "dark-mode-toggle"
        onClick = { toggleDarkMode } > { darkMode ? '☀️' : '🌙' } <
        /button> <
        /nav> <
        /div> <
        /header>
    );
}

export default Header;
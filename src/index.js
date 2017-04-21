import 'office-ui-fabric-react/dist/css/fabric.min.css';
import 'babel-polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';

import TileNavigation from './Apps/TileNavigation/TileNavigation';
import SubscriberList from './Apps/SubscriberList/SubscriberList';

const Apps = {
  TileNavigation,
  SubscriberList,
}

function renderApps(appElement) {
  let App = Apps[appElement.id];
  if (!App) return;
  let props = Object.assign({}, jQuery(appElement).data());
  render(<App {...props} />, appElement);
}

jQuery('.app').each(function (i, elem) {
  renderApps(elem);
});
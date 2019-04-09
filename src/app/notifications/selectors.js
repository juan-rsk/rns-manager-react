import React from 'react';
import { txTypes } from './types';
import { Link } from 'react-router-dom';
import AddToCalendar from 'react-add-to-calendar';
import { revealPeriod } from '../../config/contracts';

const unsealEvent = (domain, registrationDate) => ({
  title: `Unseal bid for ${domain}`,
  description: `Go to https://manager.rns.rsk.co/unseal?domain=${domain} to unseal your bid!`,
  location: '',
  startTime: new Date((registrationDate - revealPeriod) * 1000).toString(),
  endTime: new Date((registrationDate) * 1000).toString()
});

export const txDisplay = params => {
  if (!params) return null;
  switch (params.type) {
    case txTypes.START_AUCTION: return (
      <p>Auction for {params.domain} started! <Link to={`/bid?domain=${params.domain}`}>Make your bid</Link></p>
    )
    case txTypes.BID_AUCTION: return (
      <React.Fragment>
        <p>
          Bid emitted for {params.domain}.<br />
          Don't forget to unseal the bid!
        </p>
        {
          params.registrationDate && <AddToCalendar event={unsealEvent(params.domain, params.registrationDate)} />
        }
      </React.Fragment>
    )
  }
}
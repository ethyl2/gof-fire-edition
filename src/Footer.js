import React from 'react';

function Footer() {
  return (
    <footer>
      <h4>2020 Heather Nuffer</h4>
      <div className="sources">
        <div className="sources-section">
          <p>Campfire Audio: </p>
          <a
            href="https://freesound.org/people/Wdomino/sounds/507722/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source/
          </a>{' '}
          <a
            href="http://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            License
          </a>
        </div>

        <div className="sources-section">
          <p>Match Audio: </p>
          <a
            href="https://freesound.org/people/EverHeat/sounds/205527/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source/
          </a>{' '}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            License
          </a>
        </div>

        <div className="sources-section">
          <p>Lighter Audio: </p>
          <a
            href="https://freesound.org/people/whorn1/sounds/71584/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source/
          </a>{' '}
          <a
            href="https://creativecommons.org/licenses/sampling+/1.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            License
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

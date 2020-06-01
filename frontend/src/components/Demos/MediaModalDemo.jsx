import React from 'react';
import WebPage from 'components/Helpers/WebPage.jsx';
import MediaModalTarget from 'assets/MediaModal/jsx/MediaModal.jsx';
import { Button } from 'reactstrap';

const MediaModalDemo = () => (
  <WebPage pageTitle="Media Modal - Demos" pageHeading="Media Modal">
      <section align="center">
        <MediaModalTarget 
            type="image" 
            src="https://jaaproductions.tk/static/media/AlienBrowser_v8.0.7918854d.jpg" 
            title="AlienBrowser" 
            target={<Button id="image-test" color="primary" className="bob1">Image Test</Button>} 
        />
        <br />
        <br />
        <MediaModalTarget 
            type="video" 
            src="https://jaaproductions.tk:3002/rs_DriveMyCar.mp4"
            target={<Button id="video-test" color="warning" className="bob2">Video Test</Button>}
        />
        <br />
        <br />
        <MediaModalTarget 
            type="youtube" 
            src="https://www.youtube.com/embed/kfFcGQ96utU"
            target={<Button id="youtube-test" color="danger" className="bob3">YouTube Test</Button>} 
        />
        <br />
        <br />
        <MediaModalTarget 
            type="web" 
            src="https://hexipi.com"
            title="HexiPi"
            target={<Button id="web-test" className="bob4">Web Test</Button>} 
        />
        <br />
        <br />
        <MediaModalTarget 
            type="web" 
            src="https://jaaproductions.tk"
            title="J.A.A. Productions"
            target={<Button id="web-test" className="bob5">Web Test 2</Button>} 
        />
      </section>
  </WebPage>
);
  
export default MediaModalDemo;
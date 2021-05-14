import './App.css';
import { DropContainer } from './DropContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="title">
          <h1>PNGEverything</h1>
          <span><i>Everything is a PNG if you're brave enough</i></span>
        </div>
        <p className="explanation">
          PNGEverything is a file converter that lets you convert any single file into a PNG and back!<br />
          Uploading anything but a PNG file will transform it into a png file, uploading a PNG file will unscramble the PNG file back into what it originally was.
        </p>
        <div className="generate">
          <DropContainer />
          {/* <input type="file" /> */}
        </div>
      </header>
    </div>
  );
}

export default App;

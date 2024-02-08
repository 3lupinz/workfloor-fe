import Pane from '@/components/pane-system/Pane';
import PaneRow from '@/components/pane-system/PaneRow';

import PaneSystem from '@/components/pane-system/PaneSystem';

const AssemblyPage = () => {
  return (
    <PaneSystem height="calc(100vh - 56px)">
      <PaneRow height="100%">
        <Pane
          id="left-pane"
          width="300px"
          minWidth="200px"
          maxWidth="50%"
          splitter="right"
        >
          <h1>Left Pane</h1>
        </Pane>
        <Pane id="center-pane">
          <h1>Center Pane</h1>
        </Pane>
        <Pane
          id="right-pane"
          width="250px"
          minWidth="250px"
          maxWidth="50%"
          splitter="left"
        >
          <PaneSystem height="100%">
            <PaneRow height="300px" minHeight="200px" splitter="bottom">
              <Pane id="right-upper-pane">
                <h1>Right Upper Pane</h1>
              </Pane>
            </PaneRow>
            <PaneRow>
              <Pane id="right-lower-pane">
                <h1>Right Lower Pane</h1>
              </Pane>
            </PaneRow>
          </PaneSystem>
        </Pane>
      </PaneRow>
    </PaneSystem>
  );
};

export default AssemblyPage;

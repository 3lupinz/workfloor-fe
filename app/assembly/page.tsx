import Pane from '@/components/pane-system/Pane';
import PaneRow from '@/components/pane-system/PaneRow';
import PaneSystem from '@/components/pane-system/PaneSystem';

const AssemblyPage = () => {
  return (
    <PaneSystem rowHeights={['100%']} height="calc(100vh - 56px)">
      <PaneRow columnWidths={['300px', 'auto', '250px']}>
        <Pane id="left-pane" splitter="right">
          <h1>Left Pane</h1>
        </Pane>
        <Pane id="center-pane">
          <h1>Center Pane</h1>
        </Pane>
        <Pane id="right-pane" splitter="left">
          <PaneSystem
            rowHeights={['300px', 'auto']}
            height="calc(100vh - 56px)"
          >
            <PaneRow columnWidths={['100%']} splitter="bottom">
              <Pane id="right-upper-pane">
                <h1>Right Upper Pane</h1>
              </Pane>
            </PaneRow>
            <PaneRow columnWidths={['100%']}>
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

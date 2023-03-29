import React from 'react';
import { repo } from './repo';

const App = ({ config }) => {
  console.log('config: ', config);

  return (
    <div>
      {config.map((element) => {
        const Component = repo.modules[`${element.name}@${element.version}`];

        return (
          <Component
            key={element.id}
            id={element.id}
            alias={element.alias}
            forms={element.forms}
          />
        );
      })}
    </div>
  );
};

export default App;

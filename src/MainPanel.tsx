import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { CSVLink } from 'react-csv';
import { eg_stores, ug_stores } from './constants/stores';

import './style/index.css';

interface Record {
  timestamp: number;
  store: string;
  floor: number;
  num: number;
}
interface Props extends PanelProps<PanelOptions> {}
interface State {
  floor: number;
  storeList: Array<string>;
  currentStore: string;
  currentListStore: Array<string>;
  data: Array<Record>;
  fileName: string;
}

const initialState = {
  floor: 0,
  storeList: eg_stores,
  currentStore: 'None',
  currentListStore: [],
  data: [],
  fileName: '',
};

export class MainPanel extends PureComponent<Props, State> {
  state: State = { ...initialState };
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.floor !== this.state.floor) {
      if (this.state.floor == 0) {
        this.setState({
          ...initialState,
          floor: 0,
          storeList: eg_stores,
        });
      } else {
        this.setState({
          ...initialState,
          floor: -1,
          storeList: ug_stores,
        });
      }
    }
  }

  handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ ...this.state, floor: parseInt(e.target.value) });
  };

  handleSelectStore = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ ...this.state, currentStore: e.target.value });
  };

  handleAddStore = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { currentStore, currentListStore } = this.state;
    if (currentStore !== 'None' && !currentListStore.includes(currentStore))
      this.setState({ currentListStore: [...currentListStore, currentStore] });
  };

  handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ ...initialState });
  };

  addDataRecord = (store: string) => () => {
    const record = {
      timestamp: Math.round(new Date().getTime() / 1000),
      floor: this.state.floor,
      store,
      num: 1,
    };

    this.setState({ data: [...this.state.data, record] });
  };

  handleInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ fileName: e.target.value });
  };

  render() {
    const { width, height } = this.props;
    const { floor, currentStore, storeList, currentListStore, data, fileName } = this.state;

    return (
      <div
        style={{
          width,
          height,
          position: 'relative',
          padding: 10,
          overflow: 'scroll',
        }}
      >
        <div style={{ display: 'flex', verticalAlign: 'middles' }}>
          <select value={floor} onChange={this.handleFloorChange}>
            <option value={0}>Ground Floor</option>
            <option value={-1}>Basement</option>
          </select>
          <select value={currentStore} onChange={this.handleSelectStore}>
            <option value="None">None</option>
            {storeList.map(storeName => (
              <option key={storeName} value={storeName}>
                {storeName}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" style={{ marginLeft: 5 }} onClick={this.handleAddStore}>
            Add
          </button>
          <button className="btn btn-primary" style={{ marginLeft: 5 }} onClick={this.handleReset}>
            Reset
          </button>
        </div>
        <div className="list-style">
          {currentListStore.map(store => (
            <div key={store} className="row-style">
              <span>{store}</span>
              <span style={{ position: 'absolute', right: 50 }}>
                {data.filter(record => record.store == store).length}
              </span>
              <button
                className="btn btn-primary"
                style={{ position: 'absolute', top: 10, right: 0 }}
                onClick={this.addDataRecord(store)}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div className="end-section">
          <input className="input-field" onChange={this.handleInputField} value={fileName} />
          <CSVLink
            headers={['timestamp', 'store', 'floor', 'num']}
            data={data}
            filename={fileName == '' ? 'no_title.csv' : `${fileName}.csv`}
          >
            <button className="btn btn-primary">CSV</button>
          </CSVLink>
        </div>
      </div>
    );
  }
}

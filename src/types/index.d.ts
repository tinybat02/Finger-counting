declare module '*.png';

declare module 'react-csv' {
  interface ICSVLink {
    headers: Array<string>;
    data: Array<{ [key: string]: any }>;
    filename: string;
  }
  export class CSVLink extends React.Component<ICSVLink> {}
}

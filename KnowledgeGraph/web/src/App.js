import React, {useEffect, useState, useCallback} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import {useDropzone} from 'react-dropzone';

import { Grid, Input } from 'react-spreadsheet-grid'

import './App.css';

import fetchJSON from 'higher-order-helper/fetchJSON';

const host = 'http://127.0.0.1:8000'

function doQuery(query) {
  return fetchJSON(host + '/api/search', {body: {question: query}, method: 'POST'})
}

function doSave(item, field, value, method='POST') {
  return fetchJSON(host + '/api/triples', {body: {item, field, value}, method});
}

function doImport(data) {
  return fetchJSON(host + '/api/import_triples/', {body: JSON.stringify(data), method: 'POST'});
}

function doExport(data) {
  return fetchJSON(host + '/api/export_triples/');
}

function C(v) {
  switch(v) {
    case 'subj':
      return '项目名称';
    case 'repo':
      return '仓库地址';
    case 'language':
      return '语言';
    case 'default_branch':
      return '默认分支';
    case 'tag_name':
      return '标签';
    case 'download_url':
      return '下载地址';
    case 'main_language':
      return '主要语言';
    case 'code':
      return '代码行数';
    default:
      return v;
  }
}

function Field({field, value, onClick}) {
  const handleClick = () => {
    if (onClick) {
      onClick(`${field}:${value}`);
    }
  }

  let cls = 'value' + (value.length > 10 ? ' small' : '');
  let rvalue = '';
  if (field === 'homepage' || field === 'download_url' || field === 'repo') {
    rvalue = <a className={cls} href={value} target='_blank' rel="noopener noreferrer"> {value} </a>;
  } else if (value.indexOf(' ') > -1 || field === 'code' || field === 'spec_code') {
    rvalue = <span className={cls}> {value} </span>
  } else {
    cls += ' pointer'
    rvalue = <span className={cls} onClick={handleClick}> {value} </span>
  }

  return (
    <li>
      <span className='field'> {C(field)}: </span>
      {rvalue}
    </li>

  )
}

function Result({query_type, answer, msg, onClick}) {
  const handleClick = (q) => () => {
    if (onClick) {
      onClick(q);
    }
  }
  if (query_type === -1) {
    return <p> {msg} </p>
  }
  if (query_type === 4) {
    return <p> {answer} </p>
  }
  if (query_type === 1) {
    const out = [];
    for (const item in answer) {
      out.push(<Field field={item} value={answer[item]} onClick={onClick} />)
    }

    return (
      <ul className='subj_attrs'>
        <li className='add_triples'> <Triples item={answer.subj} onChange={onClick} /> </li>
        {out}
      </ul>

    )
  }
  if (query_type === 5) {
    const out = [];
    for (const item of answer) {
      out.push(<li key={item[0]} onClick={handleClick(item[1])}> <span> {item[1]} </span> </li>)
    }

    return <ul className='subj'> {out} </ul>
  }
  return <p></p>
}

function App() {
  const [query, setQuery] = useState('goconvey');
  const [result, setResult] = useState({});

  const fetchData = async (mq) => {
    if (mq) {
      setQuery(mq);
    } else {
      mq = query;
    }
    if (!mq) {
      return;
    }
    const data = await doQuery(mq)
    setResult(data);
  }

  function trySearch(evt) {
    if (evt && evt.keyCode === 13) {
      fetchData()
    }
  }

  return (
    <div className="App-main">
      <input className="search" type="text" value={query}
          onChange={(evt) => {setQuery(evt.target.value)}}
          onKeyDown={trySearch} />
      <Result {...result} onClick={fetchData} />
    </div>
  );
}

function Triples({item, onChange}) {
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  function canSave() {
    if (!item) {
      return false;
    }
    if (!field) {
      return false;
    }
    if (!value) {
      return false;
    }
    return true;
  }
  function handleSave(method) {
    return async () => {
      if (!canSave()) {
        return;
      }

      try {
        const ret = await doSave(item, field, value, method);
        alert(ret);
        onChange()
      } catch (e) {
        alert(e.message);
      }
    }
  }
  return (
    <div className="triples">
      <input type="text" placeholder="field"
          onChange={(evt) => {setField(evt.target.value)}}
          value={field}
        />
      <input type="text" placeholder="value"
          onChange={(evt) => {setValue(evt.target.value)}}
          value={value}
        />

      <button onClick={handleSave('POST')} disabled={!canSave()}> 保存 </button>
      <button onClick={handleSave('DELETE')} disabled={!canSave()} className="delete"> 删除 </button>
    </div>
  );
}

function ChatLeft({children}) {
  return (
    <div className="chat-line chat-line-left">
      <div className="chat-left">
        {children}
      </div>
    </div>
  );
}

function ChatRight({children}) {
  return (
    <div className="chat-line chat-line-right">
      <div className="chat-right">
        {children}
      </div>
    </div>
  );
}

function Chat() {
  const [query, setQuery] = useState('goconvey');
  const [result, setResult] = useState([]);

  const fetchData = async (mq) => {
    if (mq) {
      setQuery(mq);
    } else {
      mq = query;
    }
    if (!mq) {
      return;
    }
    setResult((result) => [...result, {q: mq}]);
    const data = await doQuery(mq)
    setResult((result) => [...result, {a: data}]);
    setQuery('');
    setTimeout(() => {
      document.querySelector('.view').scrollIntoView();
    }, 100)
  }

  function trySearch(evt) {
    if (evt && evt.keyCode === 13) {
      fetchData()
    }
  }

  return (
    <div className="App-main">
      <div className="chat">
        {result.map((l) => {
          if (l.q) {
            return (
              <ChatLeft> {l.q} </ChatLeft>
            );
          } else {
            return (
              <ChatRight>
                <Result {...l.a} />
              </ChatRight>
            )
          }
        })}
        <div className="view"> </div>
      </div>
      <input className="search" type="text" value={query}
          onChange={(evt) => {setQuery(evt.target.value)}}
          onKeyDown={trySearch} />
    </div>
  );
}

function Import() {
  const [columns, setColumns] = useState([]);
  const [source, setSource] = useState([]);
  const [subj, setSubj] = useState('subj');

  async function handleImport() {
      try {
        const ret = await doImport({subj, source});
        alert(ret);
      } catch (e) {
        alert(e.message);
      }
  }

  const onDrop = useCallback(acceptedFiles => {
    /* Boilerplate to set up FileReader */
    if (acceptedFiles.length === 0) {
      return;
    }
    const file = acceptedFiles[0];
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = window.XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = window.XLSX.utils.sheet_to_json(ws, {header:1});
      const columns = data[0];
      const columns_length = columns.length;
      const length = data.length;
      let out = [];
      for (let i = 1; i < length; i ++) {
        const l = {};
        for (let j = 0; j < columns_length; j ++) {
          l[columns[j]] = data[i][j];
        }
        l['id'] = i
        out.push(l);
      }
      setColumns(columns);
      setSource(out);
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  return (
    <div className="App-main">
      <div className="upload" {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      {source.length > 0 &&
        <div className="preview import">
          <Grid
            columns={columns.map((column) => {
              return {
                title: () => column,
                value: (row, { focus }) => {
                    return (
                        <Input
                          value={row[column]}
                          focus={focus}
                        />
                    );
                }
              }
            })}

            rows={source}
            getRowKey={row => row.id}
          />
          <div className="import-btn">
            <select onChange={({target}) => {setSubj(target.value)}} value={subj}>
              <option value="">请选择实体字段</option>
              {columns.map((col) =>
                <option key={col} value={col}> {col} </option>)}
            </select> &nbsp;
            <button onClick={handleImport}> 导入 </button>
          </div>
      </div>}
    </div>
  );
}

function Export() {
  const [columns, setColumns] = useState([]);
  const [source, setSource] = useState([]);

  async function fetchData() {
    const data = await doExport()
    setSource(data);
    if (data.length > 0) {
      setColumns(Object.keys(data[0]))
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  function handleExport() {
    let data = [columns];
    for (const l of source) {
      let ll = [];
      for (const col of columns) {
        ll.push(l[col]);
      }
      data.push(ll)
    }
		/* convert state to workbook */
		const ws = window.XLSX.utils.aoa_to_sheet(data);
		const wb = window.XLSX.utils.book_new();
		window.XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		window.XLSX.writeFile(wb, "sheetjs.xlsx")
  }

  return (
    <div className="App-main">
      {source.length > 0 &&
        <div className="preview">
          <Grid key="grid"
            columns={columns.map((column) => {
              return {
                title: () => column,
                value: (row, { focus }) => {
                    return (
                      <Input
                        value={row[column]}
                        focus={focus}
                      />
                    );
                }
              }
            })}

            rows={source}
            getRowKey={row => row.subj}
            isColumnsResizable
          />
          <div className="import-btn" key="button">
            <button onClick={handleExport}> 导出 </button>
          </div>
      </div>}
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={App} />
        <Route path="/chat" exact component={Chat} />
        <Route path="/import" exact component={Import} />
        <Route path="/export" exact component={Export} />
      </div>
    </Router>
  );
}

export default AppRouter;

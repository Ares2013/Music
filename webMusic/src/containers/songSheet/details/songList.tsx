import * as React from 'react'
import { BrowserRouter, Link, Route, Redirect } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import QueueAnim from 'rc-queue-anim';
import { Table, Button, Icon } from 'antd';


import Help from "../../../utils/help"

import './style.css'
/**
 * 歌曲列表
 */
@inject('musictStore')
@observer
export default class extends React.Component<any, any> {
    columns = [{
        title: '',
        dataIndex: '',
        render: (text, record, index) => {
            index = index + 1;
            index = index < 10 ? `0${index}` : index;
            return (
                <span>{index}</span>
            );
        },
        width: '10%',
    }, {
        title: '操作',
        dataIndex: '',
        render: (text, record) => {
            // <Icon type="heart-o" /> <Icon type="heart" />
            // return [
            //     <Button shape="circle" icon="heart-o" size="small" />,
            //     <Button shape="circle" icon="download" size="small" />
            // ];
            return (
                <div>
                    <Button icon="heart-o" size="small" />,
                <Button icon="download" disabled size="small" />
                </div>
            );
        },
        width: '10%',

    }, {
        title: '音乐标题',
        dataIndex: '',
        width: '30%',
        render: (text, record) => {
            return (
                <span className="song-list-name">{text.name} {text.mv ? <Icon type="play-circle" /> : null}</span>
            );
        },

    }, {
        title: '歌手',
        dataIndex: '',
        render: (text, record) => {
            let names = text.ar && text.ar.map(x => {
                return x.name
            }) || [];
            return (
                <span>{names.join(" / ")}</span>
            );
        },
        width: '20%',

    }, {
        title: '专辑',
        dataIndex: '',
        render: (text, record) => {
            return (
                <span>{text.al.name}</span>
            );
        },
        width: '20%',

    }, {
        title: '时长',
        dataIndex: '',
        render: (text, record) => {
            return (
                <span>{Help.DateFormat(text.dt, "mm:ss")}</span>
            );
        },
        width: '10%',
    }];
    onRowClick(t) {
        // console.log(t);
        this.props.musictStore.addPlayList([t]);
    }
    render() {
        const data = this.props.tracks && this.props.tracks.map(x => x);
        return (
            <div>
                {/* <style>
                    {`.ant-table-row.s-s-songlist:nth-child(${this.props.musictStore.currentIndex+1}) {
                            background:#ecf6fd;
                       }
                    `}
                </style> */}
                <Table rowKey="id" rowClassName={() => "s-s-songlist"} pagination={false} columns={this.columns} dataSource={data} onRowClick={this.onRowClick.bind(this)} />
            </div>
        )
    }
}
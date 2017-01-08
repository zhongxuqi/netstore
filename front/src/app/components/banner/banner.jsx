import React from 'react'

export default class Banner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            banners: [{
                index: 1,
                imageUrl: "http://dl.bizhi.sogou.com/images/2012/03/26/100137.jpg",
                order: 1,
            }, {
                index: 1,
                imageUrl: "http://dl.bizhi.sogou.com/images/2012/03/26/100137.jpg",
                order: 2,
            }]
        }
    }

    render() {
        return (
            <div className="container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>商品编号</th>
                            <th>图片</th>
                            <th>次序</th>
                            <th><button type="button" className="btn btn-sm btn-default">
                                <span className="glyphicon glyphicon-plus"></span>    
                                添加
                            </button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.banners.map((item, i)=>{
                                return (
                                    <tr key={i}>
                                        <td style={{verticalAlign:"middle"}}>{item.index}</td>
                                        <td><img src={item.imageUrl} style={{height:"100px"}}/></td>
                                        <td style={{verticalAlign:"middle"}}>
                                            <select className="form-control" value={item.order}>
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </select>
                                        </td>
                                        <td style={{verticalAlign: "middle"}}>
                                            <button type="button" className="btn btn-success" style={{margin:"10px"}}>
                                                <span className="glyphicon glyphicon-edit"></span>
                                                编辑
                                            </button>
                                            <button type="button" className="btn btn-danger" style={{margin:"10px"}}>
                                                <span className="glyphicon glyphicon-trash"></span>
                                                删除
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

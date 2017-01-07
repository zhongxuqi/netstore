import React from 'react';

export default class CommodityOverView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            commodities: [{
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/TB1sr9bOVXXXXaMXpXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",   
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }, {
                imageUrl: "https://g-search3.alicdn.com/img/bao/uploaded/i4/i2/TB1yWwxOVXXXXX0aVXXXXXXXXXX_!!0-item_pic.jpg_460x460Q90.jpg_.webp",
                title: "This is title",
                price: 100,
                intro: "This is intro",
            }]
        }
    }

    render() {
        return (
            <div style={{overflowY:"scroll"}}>
                <div className="carousel slide" data-ride="carousel" style={{
                    height: "450px",
                    overflow: "hidden",
                }}>
                    <ol className="carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" className="active" onClick={(()=>{
                            $('.carousel').carousel(0)
                        }).bind(this)}></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1" onClick={(()=> {
                            $('.carousel').carousel(1)
                        }).bind(this)}></li>
                    </ol>

                    <div className="carousel-inner" role="listbox">
                        <div className="item active">
                            <img className="banner" src="http://pic.58pic.com/58pic/15/35/05/95258PICQnd_1024.jpg"/>
                            <div className="carousel-caption">
                                ...
                            </div>
                        </div>
                        <div className="item">
                            <img className="banner" src="http://img.sj33.cn/uploads/allimg/201005/20100509135319416.jpg"/>
                            <div className="carousel-caption">
                                ...
                            </div>
                        </div>
                    </div>

                    <a className="left carousel-control" role="button" data-slide="prev" onClick={()=>{
                        $('.carousel').carousel('prev')
                    }}>
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="right carousel-control" role="button" data-slide="next" onClick={()=>{
                        $('.carousel').carousel('next')
                    }}>
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                <div className="container" style={{marginTop:"10px"}}>
                    <div className="col-md-3">
                        <ul className="nav nav-pills nav-stacked" role="tablist">
                            <li role="presentation" className="active"><a>Home</a></li>
                            <li role="presentation"><a>Profile</a></li>
                            <li role="presentation"><a>Messages</a></li>
                        </ul>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            {
                                this.state.commodities.map((item, index)=>{
                                    return (
                                        <div className="col-sm-6 col-md-4">
                                            <div className="thumbnail">
                                                <img src={item.imageUrl} alt="..."/>
                                                <div class="caption">
                                                    <h3><span style={{color:"#F40"}}>{item.price}</span></h3>
                                                    <h3>{item.title}</h3>
                                                    <p>{item.intro}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

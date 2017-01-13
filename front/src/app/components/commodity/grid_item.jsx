import React from 'react'

export default class CommodityGridItem extends React.Component {
    componentDidMount() {
        let inFun = (event)=>{
            $(event.currentTarget).children(".grid-item-intro").animate({
                bottom: "0px",
            }, 200, ()=>{
                $(".grid-item").off("mouseover")
                $(".grid-item").one("mouseover", inFun)
            })
        }
        $(".grid-item").off("mouseover")
        $(".grid-item").one("mouseover", inFun)
        let outFun = (event)=>{
            $(event.currentTarget).children(".grid-item-intro").animate({
                bottom: "-40px",
            }, 200, ()=>{
                $(".grid-item").off("mouseleave")
                $(".grid-item").one("mouseleave", outFun)
            })
        }
        $(".grid-item").off("mouseleave")
        $(".grid-item").one("mouseleave", outFun)
    }

    render() {
        return (
             <div className="thumbnail hover-background grid-item" onClick={this.props.onItemClick} style={{position:"relative", padding:"0px", borderRadius:"0px"}}>
                 <img className="grid-item-image" src={this.props.commodity.imageUrl} style={{"width":"100%"}}/>
                 <div className="caption">
                     <div style={{fontSize:"16px"}}><strong><span className="price-color">{this.props.commodity.price.toFixed(2)}</span></strong></div>
                     <div className="netstore-table">
                         <h4 className="netstore-table-cell">{this.props.commodity.title}</h4>
                     </div>
                 </div>
                 <div className="netstore-table-cell item-index" style={{position:"absolute", top:"0px", left:"0px", padding:"0px 5px"}}>{this.props.commodity.index}</div>
                 <div className="grid-item-intro" style={{fontSize:"14px"}}>{this.props.commodity.intro}</div>
             </div>
        )
    }
}

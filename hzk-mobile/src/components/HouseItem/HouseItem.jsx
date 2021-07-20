const HouseItem = ({ houseImg, title, desc, tags, price, style }) => {
  return (
    <div className="house" style={style}>
      <div className="imgWrap">
        <img className="img" src={`http://localhost:8080${houseImg}`} alt="" />
      </div>
      <div className="content">
        <h3 className="title">{title}</h3>
        <div className="desc">{desc}</div>
        <div>
          {tags.map((subItem, subIndex) => {
            let taga = subIndex >= 2 ? "tag3" : `tag${subIndex + 1}`;
            return (
              <span key={subIndex} className={["tag", taga].join(" ")}>
                {subItem}
              </span>
            );
          })}
        </div>
        <div className="price">
          <span className="priceNum">{price}</span> 元/月
        </div>
      </div>
    </div>
  );
};

export default HouseItem;

import React, {useEffect, useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import "./BiggestGainers.css";
import {useSelector} from "react-redux";

const BiggestGainers = () => {

  const auth = useSelector(state => state.AuthReducer);
  const [biggestGainersMarkets, setBiggestGainersMarkets] = useState([]);
  const [biggestGainersMarketsLimitStartPage, setBiggestGainersMarketsLimitStartPage] = useState(1);
  const [biggestGainersMarketsLimit, setBiggestGainersMarketsLimit] = useState(100);
  const [starBackgroundColors, setStarBackgroundColors] = useState({});

  const _handleRound = (number, decimal = 2) => {
    return number.toFixed(decimal);
  }

  const _handleNumberFormat = (number, country = 'us-US') => {
    return new Intl.NumberFormat(country).format(number)
  }

  const _handleCurrencyNumberFormat = (number, country = 'us-US', currency = 'USD') => {
    return new Intl.NumberFormat(country, {style: 'currency', currency}).format(number)
  }

  const _handleNotifyStar = (event) => {
    const id = event.target.id;
    setStarBackgroundColors(prevState => {
      return {...prevState, [id]: prevState[id] ? !prevState[id] : true}
    })
  }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/favorite', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })
      .then((result) => {
        console.log(result.data);
        if (result && result.data && ('success' in result.data) && result.data.success) {

          if (result.data && result.data.data.favoriteIds) {
            let reArrangedFavorites = {};
            result.data.data.favoriteIds.map(favoriteId => {
              reArrangedFavorites['notify-star-' + favoriteId] = true;
            });
            setStarBackgroundColors(prevState => {
              return {...prevState, ...reArrangedFavorites}
            })
          }
        }
      }).catch(err => {
      console.log(err);
    });
  }, [])

  const _handleInsertFavorite = () => {
    if (Object.keys(starBackgroundColors).length > 0) {
      let reArrangedFavorites = [];
      for (let favoriteString in starBackgroundColors) {
        if (favoriteString && starBackgroundColors[favoriteString]) {
          reArrangedFavorites.push(favoriteString.replace('notify-star-', ''));
        }
      }

      if (reArrangedFavorites.length > 0) {
        axios
          .post(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/favorite', {favorites: reArrangedFavorites}, {
            headers: {
              'Content-type': 'application/json',
              'authorization': auth.token
            }
          })
          .then((result) => {
            if (result && ('success' in result) && result.success) {

            }
          }).catch(err => {
          console.log(err);
        });
      }
    }
  };

  useEffect(_handleInsertFavorite, [starBackgroundColors]);

  const _handleRows = (rows) => {
    setBiggestGainersMarketsLimit(rows);
  }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/data-api/v3/cryptocurrency/spotlight?dataType=2&limit=30&rankRange=0', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })
      .then((result) => {
        if (result && ('data' in result) && ('data' in result.data) && result.data.data) {
          let biggestGainersMarketsResult = result.data.data.gainerList;
          setBiggestGainersMarkets(biggestGainersMarketsResult);
        }
      }).catch(err => {
      console.log(err);
    });

  }, [biggestGainersMarketsLimitStartPage, biggestGainersMarketsLimit])


  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <span style={{fontWeight: 'bold', fontSize: '1rem'}}>Today's Biggest Gainers Market Caps</span>
              {/*              <CDropdown className="m-1 btn-group">
                <span className={"market_caps_limit"}>{biggestGainersMarketsLimit}</span>
                <CDropdownToggle color="secondary">
                  Rows
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem onClick={() => _handleRows(100)}>100</CDropdownItem>
                  <CDropdownItem onClick={() => _handleRows(50)}>50</CDropdownItem>
                  <CDropdownItem onClick={() => _handleRows(10)}>10</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>*/}
            </CCardHeader>
            <CCardBody>

              <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                <tr>
                  <th></th>
                  <th className="text-center">#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>24h %</th>
                  <th>7d %</th>
                  <th>Volume(24h)</th>
                </tr>
                </thead>
                <tbody>
                {
                  !biggestGainersMarkets ?
                    <tr>
                      <td colSpan={10}>No Items</td>
                    </tr>
                    :
                    biggestGainersMarkets.map((cap, index) => {
                      let quotes = cap.priceChange;
                      let id = cap.id;
                      return (
                        <tr key={"biggest-gainers-tr-" + id}>
                          <td>

                            <CIcon name={"cil-star"} id={"notify-star-" + id}
                                   style={{color: starBackgroundColors["notify-star-" + id] ? "red" : "gray"}}
                                   onClick={_handleNotifyStar}/>

                          </td>
                          <td>{index + 1}</td>
                          <td>{cap.name} {cap.symbol}</td>
                          <td>${_handleRound(quotes?.price, 8)}</td>
                          <td>{_handleRound(quotes?.priceChange24h)} %</td>
                          <td>{_handleRound(quotes?.priceChange7d)} %</td>
                          <td>{_handleCurrencyNumberFormat(quotes?.volume24h)}</td>
                        </tr>
                      )
                    })
                }

                </tbody>
              </table>
              {/*              <CPagination
                activePage={marketCapsLimitStartPage}
                pages={marketCapsLimit}
                onActivePageChange={setMarketCapsLimitStartPage}
              />*/}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default BiggestGainers

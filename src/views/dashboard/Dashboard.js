import React, {useEffect, useState, useCallback} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem, CPagination
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ListCard from "../../components/ListCard/ListCard";
import axios from 'axios';
import "./Dashboard.css";
import {useSelector} from "react-redux";
import Loading from "../../components/Common/Loading";
import {
  faFire,
  faChartLine,
  faThumbsDown
} from '@fortawesome/free-solid-svg-icons'
import {NavLink} from "react-router-dom";

const Dashboard = () => {
  const auth = useSelector(state => state.AuthReducer);
  const [trendingMarkets, setTrendingMarkets] = useState([]);
  const [biggestGainersMarkets, setBiggestGainersMarkets] = useState([]);
  const [marketCaps, setMarketCaps] = useState([]);
  const [marketCapsSortByAsc, setMarketCapsSortByAsc] = useState([]);
  const [marketCapsWorst, setMarketCapsWorst] = useState([]);
  const [marketCapsLimitStartPage, setMarketCapsLimitStartPage] = useState(1);
  const [marketCapsLimit, setMarketCapsLimit] = useState(100);
  const [starBackgroundColors, setStarBackgroundColors] = useState({});
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currencyRates, setCurrencyRates] = useState([]);
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [watchListActive, setWatchListActive] = useState(false);

  const _handleRound = (number) => {
    return Math.round(number * 100) / 100;
  }

  const _handleNumberFormat = (number, country = 'us-US') => {
    return new Intl.NumberFormat(country).format(number)
  }

  const _handleCurrencyNumberFormat = (number, country = 'us-US', currency = 'USD') => {
    return new Intl.NumberFormat(country, {style: 'currency', currency}).format(number)
  }

  const _handleNotifyStar = (event) => {
    event.preventDefault();
    const id = event.target.id;
    setStarBackgroundColors(prevState => {
      return {...prevState, [id]: prevState[id] ? !prevState[id] : true}
    })
  }

  const _handleFetchCurrency = () => {
    try {
      axios.get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/currency-rate', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })
        .then(currencyResult => {
          if (currencyResult && currencyResult.data && ('success' in currencyResult.data) && currencyResult.data.success) {
            setCurrencyRates(currencyResult.data.data);
          }
        }).catch(error => {
        console.log(error)
      })
    } catch (e) {
      console.log(e)
    }
  };

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
    setMarketCapsLimit(rows);
  }

  useEffect(async () => {
    setIsFirstLoading(true);
    try {

      const biggestGainersResult = await axios.get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/data-api/v3/cryptocurrency/spotlight?dataType=2&limit=30&rankRange=0', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })

      if (biggestGainersResult && ('data' in biggestGainersResult) && ('data' in biggestGainersResult.data) && biggestGainersResult.data.data) {
        let biggestGainersMarketsResult = biggestGainersResult.data.data.gainerList;
        let reArrangedBiggestMarkets = [];
        biggestGainersMarketsResult.map(market => {
          reArrangedBiggestMarkets.push({
            id: market.id,
            name: market.name,
            code: market.symbol,
            rate: _handleRound(market.priceChange?.priceChange24h) + ' %'
          });

        })
        setBiggestGainersMarkets(reArrangedBiggestMarkets.splice(0, 3));
      }


      const trendingMarketsResults = await axios.get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/data-api/v3/topsearch/rank', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })

      if (trendingMarketsResults && ('data' in trendingMarketsResults) && ('data' in trendingMarketsResults.data) && trendingMarketsResults.data.data) {
        let trendingMarketsResult = trendingMarketsResults.data.data.cryptoTopSearchRanks;
        let reArrangedTrendingMarkets = [];
        trendingMarketsResult.map(market => {
          reArrangedTrendingMarkets.push({
            id: market.id,
            name: market.name,
            code: market.symbol,
            rate: _handleRound(market.priceChange?.priceChange24h) + ' %'
          });

        })
        setTrendingMarkets(reArrangedTrendingMarkets.splice(0, 3));
      }


      const favoritesResult = await axios.get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/favorite', {
        headers: {
          'Content-type': 'application/json',
          'authorization': auth.token
        }
      })

      if (favoritesResult && favoritesResult.data && ('success' in favoritesResult.data) && favoritesResult.data.success) {
        if (favoritesResult.data && favoritesResult.data.data.favoriteIds) {
          let reArrangedFavorites = {};
          let favoriteIds = [];
          favoritesResult.data.data.favoriteIds.map(favoriteId => {
            reArrangedFavorites['notify-star-' + favoriteId] = true
            favoriteIds.push(favoriteId)
          });
          setStarBackgroundColors(prevState => {
            return {...prevState, ...reArrangedFavorites}
          })
          setFavoriteIds(favoriteIds);
        }
      }

      //_handleFetchCurrency();
      setIsFirstLoading(false);
/*      setInterval(async () => {
        _handleFetchCurrency()
      }, 10000)*/

    } catch (e) {
      console.log(e)
      setIsFirstLoading(false);
    }

  }, [])


  useEffect(() => {
    //setInterval(() => {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/data-api/v3/cryptocurrency/listing?start=' + (marketCapsLimitStartPage === 1 ? marketCapsLimitStartPage : (((marketCapsLimitStartPage - 1) * marketCapsLimit)) + 1) + '&limit=' + marketCapsLimit + '&sortBy=market_cap&sortType=desc&convert=USD,BTC,ETH&cryptoType=all&tagType=all&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d', {
          headers: {
            'Content-type': 'application/json',
            'authorization': auth.token
          }
        })
        .then((result) => {
          if (result && ('data' in result) && ('data' in result.data) && result.data.data) {
            setMarketCaps(result.data.data.cryptoCurrencyList);
          }
        }).catch(err => {
        console.log(err);
      });

      axios
        .get(process.env.REACT_APP_BACKEND_URL + '/coinmarketcap/data-api/v3/cryptocurrency/listing?start=1&limit=30&sortBy=percent_change_24h&sortType=asc&convert=USD,BTC,ETH&cryptoType=all&tagType=all&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d', {
          headers: {
            'Content-type': 'application/json',
            'authorization': auth.token
          }
        })
        .then((result) => {
          if (result && ('data' in result) && ('data' in result.data) && result.data.data) {
            let reArrangedWorstMarketCaps = [];
            result.data.data.cryptoCurrencyList.map(market => {
              let quotes = market.quotes[2];
              reArrangedWorstMarketCaps.push({
                id: market.id,
                name: market.name,
                code: market.symbol,
                rate: _handleRound(quotes.percentChange24h) + ' %'
              });

            })
            setMarketCapsWorst(reArrangedWorstMarketCaps.splice(0, 3));
            setMarketCapsSortByAsc(result.data.data.cryptoCurrencyList);
          }
        }).catch(err => {
        console.log(err);
      });
    //}, 10000)
  }, [marketCapsLimit, marketCapsLimitStartPage])

  const _handleWatchList = (e) => {
    e.preventDefault();
    setWatchListActive(!watchListActive)
  }

  return (
    <>
      {
        isFirstLoading ?
          <Loading
            containerStyle={{width: "100%", height: "50vh"}}
            width={"10rem"}
            height={"10rem"}
          />
          :
          <>
            <CRow style={{marginBottom: "2rem"}}>
              <div style={{display: "flex", justifyContent: 'space-between', alignItems: "center", flexWrap: 'wrap'}}>
                {
                  currencyRates.map((currencyRate, index) => {
                    if (currencyRate.BanknoteBuying && currencyRate.BanknoteSelling) {
                      return (
                        <div style={{
                          width: '15%',
                          height: '5rem',
                          margin: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: 'white',
                          borderRadius: '1rem'
                        }} key={"currency-rate-" + index}>
                          <div style={{width: '100%', height: '33%', textAlign: 'center'}}>
                            <span style={{fontWeight: 'bold'}}>{currencyRate.code}</span>
                          </div>
                          <div style={{width: '100%', height: '33%'}}>
                            Buying: {currencyRate.BanknoteBuying} ₺
                          </div>
                          <div style={{width: '100%', height: '33%'}}>
                            Selling: {currencyRate.BanknoteSelling} ₺
                          </div>
                        </div>
                      )
                    }
                  })
                }
              </div>
            </CRow>
            <CRow>
              <ListCard title={"Trending"} listItems={trendingMarkets} to={"/trending"} icon={faFire}
                        iconColor={"red"}/>
              <ListCard title={"Biggest Gainers"} listItems={biggestGainersMarkets} to={"/biggest-gainers"}
                        icon={faChartLine} iconColor={"green"}/>
              <ListCard title={"Biggest Losers"} listItems={marketCapsWorst} to={"/biggest-losers"}
                        icon={faThumbsDown}/>
            </CRow>

            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <span
                      className={"card-header-title"}>
                      Today's Cryptocurrency Prices by Market Cap
                    </span>
                    <div className={"header-right-wrapper"}>
                      <NavLink to={""} onClick={_handleWatchList}>
                        <div className={"watchlist"}>
                          WatchList
                          <CIcon name={"cil-star"} style={{color: watchListActive ? "red" : "gray"}}/>
                        </div>
                      </NavLink>
                      <CDropdown className="m-1 btn-group">
                        <span className={"market_caps_limit"}>{marketCapsLimit}</span>
                        <CDropdownToggle color="secondary">
                          Rows
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem onClick={() => _handleRows(100)}>100</CDropdownItem>
                          <CDropdownItem onClick={() => _handleRows(50)}>50</CDropdownItem>
                          <CDropdownItem onClick={() => _handleRows(10)}>10</CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </div>
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
                        <th>Market Cap</th>
                        <th>Volume(24h)</th>
                        <th>Circulating Supply</th>
                        {/*                  <th>Last 7 days</th>*/}
                      </tr>
                      </thead>
                      <tbody>
                      {
                        !marketCaps ?
                          <tr>
                            <td colSpan={10}>No Items</td>
                          </tr>
                          :
                          marketCaps.map((cap, index) => {
                            let quotes = cap.quotes[2];
                            let id = cap.id;
                            if (watchListActive && favoriteIds && !favoriteIds.includes(id.toString())) {
                              return null;
                            }
                            return (
                              <tr key={"dashboard-tr-" + id}>
                                <td>

                                  <CIcon name={"cil-star"} id={"notify-star-" + id}
                                         style={{color: starBackgroundColors["notify-star-" + id] ? "red" : "gray"}}
                                         onClick={_handleNotifyStar}/>

                                </td>
                                <td>{marketCapsLimitStartPage === 1 ? index + 1 : (((marketCapsLimitStartPage - 1) * marketCapsLimit) + 1 + index)}</td>
                                <td>{cap.name} {cap.symbol}</td>
                                <td>${_handleRound(quotes?.price)}</td>
                                <td>{_handleRound(quotes?.percentChange24h)} %</td>
                                <td>{_handleRound(quotes?.percentChange7d)} %</td>
                                <td>{_handleCurrencyNumberFormat(quotes?.marketCap)}</td>
                                <td>{_handleCurrencyNumberFormat(quotes?.volume24h)}</td>
                                <td>{_handleNumberFormat(cap.circulatingSupply)} {cap.symbol} </td>
                                {/*<td></td>*/}
                              </tr>
                            )
                          })
                      }

                      </tbody>
                    </table>
                    <CPagination
                      activePage={marketCapsLimitStartPage}
                      pages={marketCapsLimit}
                      onActivePageChange={setMarketCapsLimitStartPage}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </>
      }

    </>
  )
}

export default Dashboard

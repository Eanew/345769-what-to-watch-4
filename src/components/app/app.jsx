import React from "react";
import {Switch, Route, BrowserRouter} from "react-router-dom";

import {connect} from "react-redux";
import {ActionCreator} from "../../reducer.js";

import pt from "../../prop-types-cover.js";

import {Screen} from "../../utils/const.js";

import Main from "../main/main.jsx";
import MoviePage from "../movie-page/movie-page.jsx";
import Player from "../player/player.jsx";
import withFullVideo from "../../hocs/with-full-video/with-full-video.js";

const PlayerWrapped = withFullVideo(Player);

class App extends React.PureComponent {
  render() {
    const {
      currentFilm,
      films,
      reviews,
      onFilmCardClick,
      onPlayButtonClick,
    } = this.props;

    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {this._renderApp()}
          </Route>
          <Route exact path="/details">
            <MoviePage
              film={currentFilm}
              reviews={reviews}
              films={films}
              onFilmCardClick={onFilmCardClick}
              onPlayButtonClick={onPlayButtonClick}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }

  _renderApp() {
    const {
      screen,
      lastScreen,
      films,
      displayedFilms,
      currentGenre,
      currentFilm,
      reviews,
      onPlayButtonClick,
      onExitButtonClick,
      onGenreTabClick,
      onFilmCardClick,
      onShowMoreButtonClick,
    } = this.props;

    switch (screen) {
      case Screen.MAIN:
        return (
          <Main
            promo={currentFilm}
            films={films}
            displayedFilms={displayedFilms}
            currentGenre={currentGenre}
            onPlayButtonClick={onPlayButtonClick}
            onGenreTabClick={onGenreTabClick}
            onFilmCardClick={onFilmCardClick}
            onShowMoreButtonClick={onShowMoreButtonClick}
          />
        );

      case Screen.MOVIE_PAGE:
        return (
          <MoviePage
            film={currentFilm}
            reviews={reviews}
            films={films}
            onPlayButtonClick={onPlayButtonClick}
            onFilmCardClick={onFilmCardClick}
          />
        );

      case Screen.PLAYER:
        const handleExitButtonClick = () => onExitButtonClick(lastScreen);
        return (
          <PlayerWrapped
            film={currentFilm}
            onExitButtonClick={handleExitButtonClick}
          />
        );

      default:
        return null;
    }
  }
}

App.propTypes = {
  screen: pt.screen,
  lastScreen: pt.screen,
  films: pt.films,
  displayedFilms: pt.films,
  currentGenre: pt.genre,
  currentFilm: pt.film,
  reviews: pt.reviews,
  onPlayButtonClick: pt.func,
  onExitButtonClick: pt.func,
  onGenreTabClick: pt.func,
  onFilmCardClick: pt.func,
  onShowMoreButtonClick: pt.func,
};

const mapStateToProps = (state) => ({
  screen: state.screen,
  lastScreen: state.lastScreen,
  currentFilm: state.currentFilm,
  films: state.films,
  currentGenre: state.genre,
  displayedFilms: state.displayedFilms,
  reviews: state.reviews,
});

const mapDispatchToProps = (dispatch) => ({
  onFilmCardClick(film) {
    dispatch(ActionCreator.setMoviePageScreen(film));
  },
  onPlayButtonClick() {
    dispatch(ActionCreator.setPlayerScreen());
  },
  onExitButtonClick(lastScreen) {
    dispatch(lastScreen === Screen.MOVIE_PAGE ? ActionCreator.setMoviePageScreen() : ActionCreator.setMainPageScreen());
  },
  onGenreTabClick(genre) {
    dispatch(ActionCreator.switchGenre(genre));
  },
  onShowMoreButtonClick() {
    dispatch(ActionCreator.showMoreFilms());
  },
});

export {App};
export default connect(mapStateToProps, mapDispatchToProps)(App);

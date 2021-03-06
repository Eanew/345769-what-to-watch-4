import React from "react";
import {configure, mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {Switch, Route, Router} from "react-router-dom";
import history from "../../history.js";

import {PREVIEW_PLAY_TIMEOUT} from "../../config.js";

import {film} from "../../test-mock.js";

import FilmCard from "../../components/film-card/film-card.jsx";
import withVideoPreview from "./with-video-preview.js";

const FilmCardWrapped = withVideoPreview(FilmCard);

configure({
  adapter: new Adapter(),
});

describe(`With video preview`, () => {

  it(`Should not playing before timeout is passed`, () => {
    const filmCard = mount(
        <Router history={history}>
          <Switch>
            <Route exact path="">
              <FilmCardWrapped
                onFilmCardClick={() => {}}
                film={Object.assign({}, film, {
                  movie: {
                    preview: ``,
                    full: ``,
                  },
                })}
              />
            </Route>
          </Switch>
        </Router>
    );

    const loadEventMock = jest.spyOn(window.HTMLMediaElement.prototype, `load`).mockImplementation(() => {});
    const playEventMock = jest.spyOn(window.HTMLMediaElement.prototype, `play`).mockImplementation(() => {});

    const preview = filmCard.find(`.small-movie-card`);

    preview.simulate(`mouseenter`, {});
    window.setTimeout(() => preview.simulate(`mouseleave`, {}), PREVIEW_PLAY_TIMEOUT / 2);

    window.setTimeout(() => {
      expect(loadEventMock).toHaveBeenCalledTimes(1);
      expect(playEventMock).toHaveBeenCalledTimes(0);
    }, PREVIEW_PLAY_TIMEOUT * 2);
  });

  it(`Should start playing after timeout is passed and then start loading on mouseleave`, () => {
    const filmCard = mount(
        <Router history={history}>
          <Switch>
            <Route exact path="">
              <FilmCardWrapped
                onFilmCardClick={() => {}}
                film={Object.assign({}, film, {
                  movie: {
                    preview: ``,
                    full: ``,
                  },
                })}
              />
            </Route>
          </Switch>
        </Router>
    );

    const loadEventMock = jest.spyOn(window.HTMLMediaElement.prototype, `load`).mockImplementation(() => {});
    const playEventMock = jest.spyOn(window.HTMLMediaElement.prototype, `play`).mockImplementation(() => {});

    const preview = filmCard.find(`.small-movie-card`);

    preview.simulate(`mouseenter`, {});

    window.setTimeout(() => {
      expect(loadEventMock).toHaveBeenCalledTimes(1);
      expect(playEventMock).toHaveBeenCalledTimes(1);

      preview.simulate(`mouseleave`, {});

      expect(loadEventMock).toHaveBeenCalledTimes(2);
      expect(playEventMock).toHaveBeenCalledTimes(1);
    }, PREVIEW_PLAY_TIMEOUT * 2);
  });
});

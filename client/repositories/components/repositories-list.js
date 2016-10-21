import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import { List } from 'material-ui/List';
import TextField, { TextFieldInput, TextFieldLabel } from 'material-ui/TextField';
import RepositoriesListItem from './repositories-list-item';

class RepositoriesList extends Component {
  constructor(props) {
    super(props);
    this.handleTrack = this.handleTrack.bind(this);
    this.showMore = this.showMore.bind(this);
    this.state = {
      search: '',
      page: 1,
      error: null,
    };
  }

  handleTrack(id, val) {
    const { trackRepository } = this.props;
    this.setState({ error: null });
    trackRepository(id, val)
      .catch((err) => {
        this.setState({ error: err.message });
      });
  }

  showMore() {
    const page = this.state.page + 1;
    this.setState({ page });
    this.props.loadMoreRepositories({ page });
  }

  handleChangeSearch = (event) => {
    const { queryRefetch } = this.props;
    const search = event.target.value;
    this.setState({ search, page: 1 });
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      queryRefetch({ page: 1, search });
    }, 600);
  }

  render() {
    const { loading, error: errorProp, repositories } = this.props;
    const { search, page, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (<div className="container-repositories-list">
      <TextField className="search-input">
        <TextFieldLabel htmlFor="search">
          Search
        </TextFieldLabel>
        <TextFieldInput
          id="search"
          value={search}
          onChange={this.handleChangeSearch}
        />
      </TextField>
      {!loading && !error && repositories.length === 0 ?
        <div className="center">
          <p>No repositories found</p>
        </div> : null}
      {loading ? <CircularProgress /> : null}
      {repositories.length > 0 ?
        <List className="repositories-list">
          {repositories.map(repository =>
            <RepositoriesListItem
              key={repository.id}
              repository={repository}
              onTrack={this.handleTrack}
            />
          )}
        </List>
        : null}
      {!loading && repositories.length === 50 * page ?
        <div className="center">
          <Button onClick={this.showMore}>Show more</Button>
        </div>
        : null}
      {error ? <p className="bg-danger">{error}</p> : null}
    </div>);
  }
}

RepositoriesList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  repositories: PropTypes.array,
  queryRefetch: PropTypes.func.isRequired,
  loadMoreRepositories: PropTypes.func.isRequired,
  trackRepository: PropTypes.func.isRequired,
};

RepositoriesList.defaultProps = {
  repositories: [],
};

export default RepositoriesList;

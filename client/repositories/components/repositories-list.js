import React, { Component, PropTypes } from 'react';
import { CircularProgress } from 'material-ui-build/src/Progress';
import Button from 'material-ui-build/src/Button';
import { List } from 'material-ui-build/src/List';
import TextField, { TextFieldInput, TextFieldLabel } from 'material-ui-build/src/TextField';
import RepositoriesListItem from './repositories-list-item';

class RepositoriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      page: 1,
      error: null,
    };
  }

  showMore = () => {
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
    const { loading, error: errorProp, repositories, onItemSelect, selectedId } = this.props;
    const { search, page, error: errorState } = this.state;
    const error = errorProp ? errorProp.message : errorState;
    return (<div className="repositories-list">
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
      {loading ? <div className="center loading"><CircularProgress /></div> : null}
      {repositories.length > 0 ?
        <List className="repositories-list">
          {repositories.map(repository =>
            <RepositoriesListItem
              key={repository.id}
              repository={repository}
              active={repository.id === selectedId}
              onClick={onItemSelect}
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
  selectedId: PropTypes.string,
  repositories: PropTypes.array,
  queryRefetch: PropTypes.func.isRequired,
  loadMoreRepositories: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired,
};

RepositoriesList.defaultProps = {
  repositories: [],
};

export default RepositoriesList;

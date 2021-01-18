import React from 'react';
import styles from './Repo.module.css';
import PropTypes from 'prop-types';

import iconFork from "./fork.svg";
import iconStar from "./star.svg";
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

class Repo extends React.Component {
	state = {
		isLoadingRepo: true,
		repoList: [],
		errorRepo: false,
		firstRepo: 0,
    lastRepo: 3 
	}

	componentDidMount() {
		octokit.repos.listForUser({
			username: 'tzAriadna'
		}).then(({ data }) => {
			this.setState({
				repoList: data,
				isLoadingRepo: false
			})
		}).catch(err => {
      this.setState({
          errorRepo: true,
          isLoadingRepo: false
      })
	  });
	};

	nextPage = () => {
    if(this.state.lastRepo < this.state.repoList.length) {
      this.setState( state => ({
        firstRepo: state.firstRepo + 3,
        lastRepo: state.lastRepo + 3,
      }));
    }
  };

	previousPage = () => {
    if (this.state.firstRepo !== 0 ) {
      this.setState( state => ({
        firstRepo: state.firstRepo - 3,
        lastRepo: state.lastRepo - 3,
      })); 
    }
  };

	render() {
		const { isLoadingRepo, repoList, errorRepo, firstRepo, lastRepo } = this.state;
		const repoListInPage = repoList.slice(firstRepo, lastRepo);

		return (
			<CardContent>
				<div>{isLoadingRepo ? <CircularProgress color="secondary" className={styles.preloader}/> : 
					<div>					
						{!isLoadingRepo && <ol>
							{errorRepo ? <div className={styles.error}>Ошибка: Репозитории не найдены </div> : <div>
								<h2 className={styles.title}>Мои репозитории</h2>
								<div className={styles.wrap}>
									{repoListInPage.map(repo => (
										<a href={repo.html_url} className={styles.repo} key={repo.id}>
											<h3 className={styles.name}>{repo.name}</h3>
											<div className={styles.bottom}>
												<p className={styles.lang}><span className={repo.language ? styles.round : ""}>{repo.language}</span></p>
												<p className={styles.desc}><img src={iconStar} alt=""/>{repo.stargazers_count}</p>
												<p className={styles.desc}><img src={iconFork} alt=""/>{repo.forks_count}</p>
												<p className={styles.desc}>update: { new Date(`${repo.updated_at}`).toLocaleString("ru-RU")}</p>
											</div>
										</a>))
									}
								</div>
								<div className={styles.pagination}>
		              <button
		                className={styles.btn}
		                onClick={this.previousPage}
		                disabled={firstRepo < 3}
		              >назад
		              </button>
		              <button
		                className={styles.btn}
		                onClick={this.nextPage}
		                disabled={repoList.length < lastRepo}
		              >вперед
		              </button>
		            </div>
							</div>}
						</ol>}
					</div>
				}</div>
			</CardContent>
		)
	}
};

Repo.propTypes = {
  isLoadingRepo: PropTypes.bool.isRequired,
  repoList: PropTypes.array.isRequired,
  errorRepo: PropTypes.bool.isRequired,
  firstRepo: PropTypes.number.isRequired,
  lastRepo: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired
};

export default Repo;
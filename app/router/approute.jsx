import React from 'react';
import {RouteHandler, Link } from 'react-router';
import AddItem from '../components/additem.jsx';
import Storage from '../lib/localstorage';

/**
 * router, to hold the state of UI
 */
class AppRoute extends React.Component {
  constructor() {
    super();
    this.state = {showAddPop: false, items: []};
    this.addTask = this.addTask.bind(this);
    this.finishTask = this.finishTask.bind(this);
    this.showPop = this.showPop.bind(this);
    this.hidePop = this.hidePop.bind(this);
    this.storage = Storage();
  }

  componentDidMount() {
    let items = this.storage.get('tasks') || [];
    this.setState({items: items});
  }

  showPop() {
    this.setState({showAddPop: true});
  }

  hidePop() {
    this.setState({showAddPop: false});
  }

  addTask(name, desc) {
    let current = new Date(),
      taskId = this.state.items[0] ? this.state.items[0].id + 1 : 1,
      created = (current.getMonth() + 1) + '月' + current.getDate() + '日 ' + current.getHours() + ':' + (current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes()),
      item = {
        id: taskId,
        name: name,
        desc: desc,
        created: created,
        state: 0,
        finished: 0,
        thought: ''
      };
    this.state.items.unshift(item);
    this.setState({items: this.state.items});
    this.storage.set('tasks', this.state.items);
  }

  finishTask(id, thought) {
    let current = new Date(),
      finished = (current.getMonth() + 1) + '月' + current.getDate() + '日 ' + current.getHours() + ':' + (current.getMinutes() < 10 ? '0' + current.getMinutes() : current.getMinutes()),
      task = null;

    this.state.items.forEach(function(val) {
      if (val.id === id) {
        task = val;
      }
    });

    if (!task) {
      return;
    }

    task.state = 1;
    task.finished = finished;
    task.thought = thought;

    this.state.items.forEach(function(val, index) {
      if (val.id === id) {
        this.state.items[index] = task;
      }
    }.bind(this));

    this.setState({items: this.state.items});
    this.storage.set('tasks', this.state.items);
  }

  render() {
    return (
      <div>
        <header className="header">
          <h2>Todo</h2>
          <div className="fa fa-plus" onClick={this.showPop}></div>
        </header>
        {this.props.children && React.cloneElement(this.props.children, {
          tasks: this.state.items,
          finishTask: this.finishTask,
          addTask: this.showPop
        })}
        <AddItem needShow={this.state.showAddPop} hidePop={this.hidePop} addTask={this.addTask}></AddItem>
        <nav className="menu">
          <ul>
            <li><Link to={`/tasks`} activeClassName="active" className={'fa fa-tasks ' + (this.props.location.pathname === '/' ? ' active' : '')}></Link></li>
            <li><Link to={`/tasks/completed`} activeClassName="active" className="fa fa-check-circle"></Link></li>
            <li><Link to={`/tasks/uncompleted`} activeClassName="active" className="fa fa-clock-o"></Link></li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default AppRoute;

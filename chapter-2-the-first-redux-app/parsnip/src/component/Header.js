import React, { Component } from 'react'
export default class Header extends Component {
    render() {
        const projectOptions = this.props.projects.map(project =>
            <option key={project.id} value={project.id}>
                {project.name}
            </option>)

        return (
            <div className="project-item">
                Project:
                <select onChange={this.props.onCurrentProjectChange} className="project-menu">
                    <option>Select your project</option>
                    {projectOptions}
                </select>
            </div>
        )
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Me} from 'App/MyActions';
import {Layout, Section} from 'classui/Components/Layout';

interface IProps {};
interface IState {
	students: any
};

export class Students extends React.Component<IProps, IState> {
	componentDidMount() {
		/*
		Database.getStudents().then((data)=>{
			this.setState({
				students:data
			});
		}).catch(console.error);
		*/
	}
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			students: []
		}
	}
	render() {
		return <Layout>
			<Section width={300}>
			{
				this.state.students.map((student: any)=>{
					return <div className="card-1" style={{backgroundColor: "white", padding: 10, margin: 15}} key={student._id}>
						<h4>{student.name}</h4>
						<h5>Class : {student.batch}-{student.branch}</h5>
						<h5>Learning Progress : 50%</h5>
					</div>
				})
			}
			</Section>
		</Layout>;
	}
};
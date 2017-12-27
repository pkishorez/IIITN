import {Register, Profile, Students, LearnByDoing, StarterView, StarterManagement} from 'App/Pages';
import {Home} from 'App/Pages/Presentation/Home';
import {RequireAuthentication} from 'App/Pages/Presentation/Login';
import {PlaygroundTypescript, PlaygroundCanvas2D} from 'App/Pages/Playground/';
import {TasksCanvasView, TaskManager, TasksTypescriptView, TasksView} from 'App/Pages/Task/';
import {SessionManage} from 'App/Pages/Session/Manage/';
import {SessionView} from 'App/Pages/Session/index';
import {GetState} from 'App/State';

export const DEFAULT_REDIRECT_URL: string = "/playground";

let RouteConfig: {
	[id: string]: {
		route: string
		component: any
	}[]
} = {
	"ANY": [
		{
			route: "/home",
			component: Home
		},{
			route: "/2dplayground",
			component: PlaygroundCanvas2D
		},{
			route: "/playground",
			component: PlaygroundTypescript
		},{
			route: "/task",
			component: TasksView
		}
	],

	"USER": [
		{
			route: "/task/canvas",
			component: TasksCanvasView
		},{
			route: "/task/basics",
			component: TasksTypescriptView
		},{
			route: "/lbd",
			component: LearnByDoing
		},{
			route: "/lbd/starter",
			component: StarterView
		},{
			route: "/students",
			component: Students
		},{
			route: "/session",
			component: SessionView
		}
	],

	"ADMIN": [
		{
			route: "/lbd/starter/manage",
			component: StarterManagement
		},{
			route: "/task/manage",
			component: TaskManager
		},{
			route: "/session/manage",
			component: SessionManage
		}
	]
}

type IRoles = "ANY" | "USER" | "ADMIN";
interface IRouteDetails {
	[id: string]: {
		role: IRoles,
		component: any
	}
}
export let getRouteDetails = (): IRouteDetails=>{
	let routeDetails: IRouteDetails = {};

	Object.keys(RouteConfig).map((role)=>{
		RouteConfig[role].map((route)=>{
			routeDetails = {
				...routeDetails,
				[route.route as any]: {
					role,
					component: route.component
				}
			};
		})
	})

	return routeDetails;
}
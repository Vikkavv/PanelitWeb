import React from "react";

class ErrorBoundary extends React.Component{
    constructor(props){
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error){
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error catched by ErrorBoundary -> ", error);
        console.error("Error info ->", errorInfo);
        this.setState({error, errorInfo});
    }

    render() {
        if(this.state.hasError) {
            return (
                <div className="padding-1 text-white bgWindow">
                    <h2>Something went wrong...</h2>
                    <details>
                        <pre className="text-wrap">
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </details>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;
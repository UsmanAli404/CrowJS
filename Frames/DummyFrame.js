import { Component } from "../Core/Component.js";

export class DummyFrame extends Component{
    static RESIZE_DF = "ResizeDF";
    static REPOSITION_DF = "RepositionDF";

    /**
   * Creates a temporary frame used during resize/reposition operations
   * @param {number} x - The x-coordinate
   * @param {number} y - The y-coordinate
   * @param {number} width - The width
   * @param {number} height - The height
   * @param {string} type - Type of dummy frame (RESIZE_DF or REPOSITION_DF)
   */
    constructor(x, y, width, height, type){
        super(x, y, width, height, {type: type});
        //parent will store reference to the attached frame
        //root will store the ref of root

        if(this.type === "ResizeDF"){
            this.nearestBorder = null;
        } else if(this.type === "RepositionDF"){
            this.prevX = null;
            this.prevY = null;
            this.xDist = null;
            this.yDist = null;
        }

        this.addEventListener("hover", (event)=> this.onMouseHover(event));
        this.addEventListener("drag", (event)=> this.onMouseDrag(event));
        this.addEventListener("release", (event) => this.onMouseRelease(event));
    }

    /**
   * Handles mouse hover events on the dummy frame
   * @param {GUIEvent} event - The hover event
   */
    onMouseHover(event){
        // console.log("hovering ...");
        event.stopPropagation();
    }

    /**
   * Handles mouse drag events for resizing or repositioning
   * @param {GUIEvent} event - The drag event
   */
    onMouseDrag(event){
        if(this.type === "ResizeDF"){
            this.updateDimensions();
        } else if(this.type === "RepositionDF"){
            this.updatePosition();
        }

        event.stopPropagation();
    }

    /**
   * Updates position during repositioning operations
   */
    updatePosition(){
        // console.log("updating position...");
        this.prevX = this.x;
        this.prevY = this.y;
    
        this.x = mouseX - abs(this.xDist);
        this.y = mouseY - abs(this.yDist);
    }

    /**
   * Updates dimensions during resizing operations
   */
    updateDimensions(){
        // console.log("updating dimensions...");
        const effMinW = this.parent.getEffectiveMinWidth();
        const effMinH = this.parent.getEffectiveMinHeight();

        switch(this.nearestBorder){
            case "left":
                if(this.x+this.width-mouseX>=effMinW){
                    this.width = this.x + this.width - mouseX;
                    this.x = mouseX;
                }

                break;
            case "right":
                if(mouseX-this.x>=effMinW){
                    this.width = mouseX - this.x;
                }

                break;
            case "top":
                if(this.y+this.height-mouseY>=effMinH){
                    this.height =this.y + this.height - mouseY;
                    this.y = mouseY;
                }

                break;
            case "bottom":
                if(mouseY-this.y>=effMinH){
                    this.height = mouseY - this.y;
                }

                break;
            case "top-left":
                if(this.x+this.width-mouseX>=effMinW){
                    this.width = this.x + this.width - mouseX;
                    this.x = mouseX;
                }
    
                if(this.y+this.height-mouseY>=effMinH){
                    this.height =this.y + this.height - mouseY;
                    this.y = mouseY;
                }

                break;
            case "top-right":
                if(mouseX-this.x>=effMinW){
                    this.width = mouseX - this.x;
                }
    
                if(this.y+this.height-mouseY>=effMinH){
                    this.height =this.y + this.height - mouseY;
                    this.y = mouseY;
                }

                break;
            case "bottom-left":
                if(this.x+this.width-mouseX>=effMinW){
                    this.width = this.x + this.width - mouseX;
                    this.x = mouseX;
                }
    
                if(mouseY-this.y>=effMinH){
                    this.height = mouseY - this.y;
                }

                break;
            case "bottom-right":
                if(mouseX-this.x>=effMinW){
                    this.width = mouseX - this.x;
                }
    
                if(mouseY-this.y>=effMinH){
                    this.height = mouseY - this.y;
                }

                break;
            default:
                console.log("wrong data in nearestBorder!");

                break;
        }
    }

    /**
   * Handles mouse release to finalize operations and transfer values to parent
   * @param {GUIEvent} event - The release event
   */
    onMouseRelease(event){
        // console.log("mouse released...");
        this.parent.x = this.x;
        this.parent.y = this.y;
        this.parent.width = this.width;
        this.parent.height = this.height;
        this.parent.isBannerShown = false;
        this.parent.redraw();

        this.root.activeElement = this.parent;
        this.root.remove(this);

        // event.stopPropagation();
    }
    
    /**
   * Renders the dummy frame outline during operations
   */
    show(){
        push();
        if(this.parent.borderColor){
            stroke(this.parent.borderColor);
        }
        strokeWeight(this.parent.borderWidth);
        noFill();
        rect(this.x, this.y, this.width, this.height, this.parent.cornerRadius);
        pop();
    }
}
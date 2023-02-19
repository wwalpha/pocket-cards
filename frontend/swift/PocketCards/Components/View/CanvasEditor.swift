//
//  CanvasEditor.swift
//  PocketCards
//
//  Created by macmini on 2023/02/19.
//

import PencilKit
import SwiftUI
import UIKit

struct CanvasEditor: View {
    @State private var canvasView: PKCanvasView = .init()
    @State private var toolPickerIsActive = false
    @Binding var isShowing: Bool
    var imageName: String = ""

    var body: some View {
        GeometryReader { _ in
            VStack {
                if isShowing {
                    VStack {
                        Button {
                            isShowing = false
                            toolPickerIsActive = false
                        } label: {
                            Text("Close")
                                .frame(height: 48, alignment: .center)
                        }

                        CanvasView(canvasView: self.$canvasView, toolPickerIsActive: $toolPickerIsActive)
                            .padding(24.0)
                            .background(Color.gray)
                            .onAppear {
                                let uiImage = FileManager.default.loadImage(fileName: imageName)!
                                let imageView = UIImageView(image: uiImage)

                                imageView.contentMode = .scaleAspectFit

                                canvasView.addSubview(imageView)
                                canvasView.sendSubviewToBack(imageView)

                                toolPickerIsActive = true
                            }
                    }

                } else {
                    Text("")
                }
            }
            .padding()
            .background(Color.black)
        }
    }
}

struct CanvasEditor_Previews: PreviewProvider {
    @State static var isShowing = true

    static var previews: some View {
        CanvasEditor(isShowing: $isShowing, imageName: "002.png")
            .previewInterfaceOrientation(.landscapeLeft)
    }
}

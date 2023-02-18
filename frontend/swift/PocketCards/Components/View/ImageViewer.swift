//
//  ImageView.swift
//  PocketCards
//
//  Created by macmini on 2022/05/05.
//

import PencilKit
import SwiftUI
import UIKit

struct ImageViewer: View {
    @State private var canvasView: PKCanvasView = .init()
    @State private var toolPickerIsActive = false
    @Binding var isShowing: Bool
    var imageName: String = ""

    var body: some View {
        GeometryReader { geo in
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
                                let width = geo.size.width - 48
                                let height = geo.size.height - 48

                                let uiImage = FileManager.default.loadImage(fileName: imageName)!
                                let imageView = UIImageView(image: uiImage)

                                let imageWidth = uiImage.size.width
                                let imageHeight = uiImage.size.height

                                let scaleHeight = width / imageWidth
                                let scaleWidth = height / imageHeight
                                let scale = scaleHeight > scaleWidth ? scaleWidth : scaleHeight

                                imageView.frame = CGRect(x: 0,
                                                         y: 0,
                                                         width: imageWidth * scale,
                                                         height: imageHeight * scale)

                                imageView.center = CGPoint(x: width / 2,
                                                           y: (height - 60) / 2)

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

struct ImageViewer_Previews: PreviewProvider {
    @State static var isShowing = true

    static var previews: some View {
        ImageViewer(isShowing: $isShowing, imageName: "002.png")
            .previewInterfaceOrientation(.landscapeLeft)
    }
}

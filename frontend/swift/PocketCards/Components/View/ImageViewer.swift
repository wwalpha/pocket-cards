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
        VStack {
            if isShowing {
                Image(uiImage: FileManager.default.loadImage(fileName: imageName)!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .onTapGesture {
                        isShowing = false
                    }
            } else {
                Text("")
            }
        }
        .padding()
        .background(Color.black)
    }
}

struct ImageViewer_Previews: PreviewProvider {
    @State static var isShowing = true

    static var previews: some View {
        ImageViewer(isShowing: $isShowing, imageName: "002.png")
            .previewInterfaceOrientation(.landscapeLeft)
    }
}

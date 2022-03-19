//
//  ReportView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/18.
//

import SwiftUI

struct ReportView: View {
    var interactor: ReportBusinessLogic?

    var body: some View {
        Text(/*@START_MENU_TOKEN@*/"Hello, World!"/*@END_MENU_TOKEN@*/)
            .onAppear {
                interactor?.query()
            }
    }
}

extension ReportView: ReportDisplayLogic {}

extension ReportView {
    func configureView() -> some View {
        var view = self
        let interactor = ReportInteractor()
        let presenter = ReportPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct ReportView_Previews: PreviewProvider {
    static var previews: some View {
        ReportView()
    }
}
